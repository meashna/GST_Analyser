import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./Pdf_Upload.module.css";
import { MdCloudUpload } from "react-icons/md";
import pdfToText from "react-pdftotext";

const Pdf_Upload = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [text, setText] = useState("");
  const [Income, setIncome] = useState(null);
  const [Profit, setProfit] = useState(null);

  const onFileChange = async (file) => {
    try {
      const extractedText = await pdfToText(file);
      setText(extractedText);
      console.log("This is the text ", extractedText);

      // Define regular expressions to match income and profit
      const incomeRegex = /Income\s*[:=]\s*(\d+)\b/i;
      const profitRegex = /Profit\s*[:=]\s*(\d+)\b/i;

      // Extract income value
      const incomeMatch = incomeRegex.exec(extractedText);
      const income = incomeMatch ? parseInt(incomeMatch[1]) : null;

      // Extract profit value
      const profitMatch = profitRegex.exec(extractedText);
      const profit = profitMatch ? parseInt(profitMatch[1]) : null;

      console.log("Income:", income);
      console.log("Profit:", profit);

      setIncome(income);
      setProfit(profit);
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
    }
  };

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div>
      <div className={styles.main_cont}>
        <div className={styles.left_side}>
          <section className={styles.container}>
            <div className={styles.head}>Upload Your PDF Files Here</div>
            <div {...getRootProps({ className: "dropzone" })}>
              {/* <input {...getInputProps()} /> */}
              <input
                {...getInputProps({
                  onChange: (e) => onFileChange(e.target.files[0]),
                })}
              />
              <div className={styles.input_box_cont}>
                <MdCloudUpload className={styles.cloud_icon} />
                <button className={styles.input_box}>Browse</button>
              </div>
            </div>
          </section>
          <section className={styles.container_view_files}>
            <h4>Files</h4>
            <ul>{files}</ul>
          </section>
          <section className={styles.container_view_text}>
            <h4>Extracted Text</h4>
            <p>{text}</p>
          </section>
        </div>
        <div className={styles.right_side}>
          <div className={styles.analyse_head}>
            <h3>Analysed report </h3>
            <br></br>
            <div>Income : {Income}</div>
            <div>Profit : {Profit}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pdf_Upload;
