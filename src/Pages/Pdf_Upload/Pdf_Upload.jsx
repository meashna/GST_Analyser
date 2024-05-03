import React from "react";
import { useDropzone } from "react-dropzone";
import styles from "./Pdf_Upload.module.css";
import { MdCloudUpload } from "react-icons/md";

const Pdf_Upload = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div>
      <section className={styles.container}>
        <div className={styles.head}>Upload Your PDF Files Here</div>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
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
    </div>
  );
};

export default Pdf_Upload;
