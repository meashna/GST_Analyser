import React, { useState } from "react";
import styles from "./Report.module.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const Report = ({ text }) => {
  const [responseText, setResponseText] = useState("");
  const [name, setName] = useState("");
  const [income, setIncome] = useState(null);
  const [profit, setProfit] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Set loading state to true when submitting

    const prompt = `
      Analyze the following text  ${text} and create a detailed GST analysis report. The report should include the following sections:
      
     General Information
      -Acknowledgement Number
      -Date of filing :
     - PAN
     - Name
     - Address
    
      Income Details
        - Total Income
    
      Tax Details
        - Taxable Income
        - Book Profit under MAT (where applicable)
        - Adjusted Total Income under AMT (where applicable)
        - Net Tax Payable
        - Interest and Fee Payable
        - Total Tax, Interest, and Fee Payable
        - Taxes Paid
        - (+) Tax Payable / (-) Refundable
    
      Business Performance
        - Current Year Business Loss (if any)
        - Profit or Loss Statement
    
      Accreted Income & Tax Details
        - Accreted Income as per Section 115TD
        - Additional Tax Payable u/s 115TD
        - Interest Payable u/s 115TE
        - Additional Tax and Interest Payable
        - Tax and Interest Paid
        - (+) Tax Payable / (-) Refundable
    
      Filing Information
        - Acknowledgement Number
        - Date of Filing
        - PAN
        - Status
        - Form Number
        - Filed u/s
        - e-Filing Acknowledgement Number
        - Income Tax Return Submission Details (including IP address, verification method, and date)
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const response_text = await response.text();
    setResponseText(response_text);

    // Extract name from response_text
    const nameRegex = /Name\s*[:=]\s*([\w\s]+)/i;
    const nameMatch = nameRegex.exec(response_text);
    const extractedName = nameMatch ? nameMatch[1] : null;
    setName(extractedName);

    // Extract income from response_text
    const incomeRegex = /Total Income\s*[:=]\s*([\d,]+)/i;
    const incomeMatch = incomeRegex.exec(response_text);
    const extractedIncome = incomeMatch
      ? incomeMatch[1].replace(/,/g, "")
      : null;
    setIncome(extractedIncome);

    // Extract profit from response_text
    const profitRegex = /Net Tax Payable\s*[:=]\s*([\d,]+)/i;
    const profitMatch = profitRegex.exec(response_text);
    const extractedProfit = profitMatch
      ? profitMatch[1].replace(/,/g, "")
      : null;
    setProfit(extractedProfit);

    setIsLoading(false); // Set loading state to false when response is received
  };

  return (
    <div>
      <form>
        {isLoading ? (
          <div className={styles.loader}>Loading...</div>
        ) : (
          <button
            type="submit"
            onClick={handleSubmit}
            className={styles.button_generatereport}
          >
            Generate Report
          </button>
        )}
      </form>
      {responseText && ( // Check if responseText has a value before rendering the table
        <table className={styles.reportTable}>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{name}</td>
            </tr>
            <tr>
              <td>Income</td>
              <td>{income}</td>
            </tr>
            <tr>
              <td>Profit</td>
              <td>{profit}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Report;
