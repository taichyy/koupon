import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET() {
    const data = {
        name: 'Bishal Shrestha',
        age: '27'
    }

    let resultArr = []
    for (let i = 13301; i <= 13310; i++) {
        console.log(i)
        try {
            const res = await fetch(`https://www.kfcclub.com.tw/GetCouponData/${i}`, {
                method: 'GET',
            })
            if (res.ok) {
                
                let responseText = await res.text();
                let noCouponStr = "<NewDataSet>\r\n  <tablename>\r\n    <Column1>tablename</Column1>\r\n    <Column2>Coupon</Column2>\r\n    <Column3>Coupon_Product</Column3>\r\n    <Column4>Coupon_SpecificProducts</Column4>\r\n  </tablename>\r\n</NewDataSet>";
                // If the coupon exists
                if (responseText != noCouponStr) {
                    // Check if expried
                    let date = new Date()
                    let nowYear = date.getFullYear().toString()
                    let nowMonth = (date.getMonth()+1).toString()
                    nowMonth.length == 1 ? nowMonth = '0'+nowMonth : null;
                    let nowDate = date.getDate().toString()
                    let nowFull = nowYear+nowMonth+nowDate
                    // 使用正则表达式来匹配<EndDate>和</EndDate>之间的内容
                    let indexF = responseText.indexOf('<EndDate>')+9
                    let indexB = responseText.indexOf('</EndDate>')
                    let fullTime = responseText.substring(indexF, indexB)
                    let expFull = fullTime.split(' ')[0].replaceAll('-','')
                    // Get coupon name
                    indexF = responseText.indexOf('<Title>')+7
                    indexB = responseText.indexOf('</Title>')
                    let name = responseText.substring(indexF, indexB)
                    // Get product code
                    indexF = responseText.indexOf('<ProductCode>')+13
                    indexB = responseText.indexOf('</ProductCode>')
                    let code = responseText.substring(indexF, indexB)
                    // If not expired
                    if ( nowFull < expFull) {
                        resultArr.push({
                            "coupon" : i,
                            "name" : name,
                            "productCode" : code,
                            "exprieDate" : expFull,
                        });
                    }
                    console.log(i)
                    // https://www.kfcclub.com.tw/meal/TA4165

                    // Puppeteer 
                    const puppeteer = require('puppeteer');

                    (async () => {
                        // Open new browser and page
                        const browser = await puppeteer.launch();
                        const page = await browser.newPage();
                        await page.goto('https://example.com');
                        await page.screenshot({path: 'example.png'});
                        
                        await browser.close();
                    })();
                }
            }
        } catch (err) {
            return NextResponse.json('Not');
        }
    }

    return NextResponse.json(resultArr);
}