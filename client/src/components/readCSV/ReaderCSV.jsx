import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { read, utils, writeFile } from 'xlsx';
import { CSVLink } from 'react-csv';

export const ReaderCSV = (props) => {
  const { setDataUpload } = props;
  const [data, setData] = useState([]);
  console.log({ csv_data: data });

  const [users, setUsers] = useState([]);
  console.log({ users: users });

  const [isDownload, setIsDownload] = useState(false);

  //======={uplaod excel /csv spreadsheet}==========

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
    };
  };

  // useEffect(() => {});

  // const getCSV = async () => {
  //     try {
  //       const response = await axios.get(`/auth/facebook/success`);
  //       if (response.data) {
  //         return response.data;
  //       }
  //     } catch (error) {
  //       const message =
  //         (error.response && error.response.data && error.response.data.message) ||
  //         error.message ||
  //         error.toString();
  //       console.log(message);
  //     }
  //   };

  // const getCSV = async () => {
  //   fetch('https://jsonplaceholder.typicode.com/users')
  //   .then(response => response.json())
  //   .then(json => console.log(json))
  // };

  useEffect(() => {
    getCSV();
  }, []);
  //======={fetch data and convert to excel /csv spreadsheet}==========

  const getCSV = async () => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((json) => {
        let dataL = [];
        json.forEach((item) => {
          let object = {
            id: item.id,
            name: item.name,
            username: item.username,
            email: item.email,
          };
          dataL.push(object);
        });

        setUsers(dataL);
      });
  };

  //======={export excel /csv spreadsheet}==========
  //https://www.youtube.com/watch?v=fNVQJkufMhc
  const handleExport = async () => {
    const headings = [['ID', 'Name', 'Age']];
    const wb = utils.book_new();
    const ws = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    // utils.sheet_add_json(ws,users,{origin:'A1', skipHeader:false})
    utils.sheet_add_json(ws, data, { origin: 'A1', skipHeader: false });
    utils.book_append_sheet(wb, ws, 'Report');
    // writeFile(wb, 'Users Report.xlsx');
    writeFile(wb, 'upload_template.xlsx');
  };

  //======={downlaod excel /csv spreadsheet from google}==========
  const sample_roomFileUrl = `https://docs.google.com/spreadsheets/d/19ye-qaV9ffIlj9IogLhhsrxjl2FLEAzK/edit?usp=sharing&rtpof=true&sd=true`;
  const sample_roomFileId = `19ye-qaV9ffIlj9IogLhhsrxjl2FLEAzK`;
  const downloadLinkSampleRoom = `https://drive.google.com/uc?export=do&id=${sample_roomFileId}`;

  const roomFileUrl = `https://docs.google.com/spreadsheets/d/1-FOoz2uAjZRJ6FyNLKxr011rnI0YchuY/edit?usp=sharing&ouid=110230640942167012709&rtpof=true&sd=true`;
  const roomFileId = `1-FOoz2uAjZRJ6FyNLKxr011rnI0YchuY`;
  const downloadLinkRoom = `https://drive.google.com/uc?export=do&id=${roomFileId}`;

  //window.location.href = downloadLinkSampleRoom;
  //window.location.href = downloadLinkRoom;
  //======={convert comma seperated string to array}==========
  const str =
    'Wifi,Parking,Room service,Non-smoking rooms,Airport shuttle,Restaurant,Facilities for disabled guest,Fitness centre,Spa and wellness centre,Swimming Pool,Pets allowed,24-hour front desk';
  let temp = new Array();

  temp = str.split(',');

  console.log({ temp: temp });

  //======={Download PNG, PDF, CSV, ZIP with url }==========
// current file locationed in Public folder , but can be used with any URL
  const PNG_Url = 'http://localhost:300/file_png.png';
  const PDF_Url = 'http://localhost:300/file_pdf.pdf';
  const CSV_Url = 'http://localhost:300/file_csv.csv';
  const ZIP_Url = 'http://localhost:300/file_zip.zip';

  const downloadFileFromUrl = (url) => {
    const fileName = url.split('/').pop();
    const aTag = document.createElement('a');
    aTag.href = url;
    aTag.setAttribute('download', fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  const isHome = (
    <>
      {/* https://www.youtube.com/watch?v=YJCZCdLEMo4 */}
      {isDownload && (
        <>
          <div className="text-center p-[20px] text-[22px]">
            {users.length > 0 && (
              <>
                <h3 className="">Export CSV</h3>

                <table class="mt-[30px]">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Name</th>
                      <th scope="col">USERNAME</th>
                      <th scope="col">EMAIL</th>
                    </tr>
                  </thead>
                  {users.map((user) => (
                    <tbody>
                      <tr key={user.id}>
                        <th scope="row">{user.id}</th>
                        <td>{user?.name}</td>
                        <td>{user?.username}</td>
                        <td>{user?.email}</td>
                      </tr>
                    </tbody>
                  ))}
                </table>
                {/** Export csv from url*/}
                <div className="">
                  <CSVLink data={users}>Export CSV</CSVLink>
                </div>
              </>
            )}
          </div>
          <div className="">Download PNG/PDF/CSV/ZIP</div>
          <div className="flex flex-col gap-2 justify-center items-center">
            <button
              className=""
              onClick={() => {
                downloadFileFromUrl(PNG_Url);
              }}
            >
              Downlaod PNG
            </button>
            <button
              className=""
              onClick={() => {
                downloadFileFromUrl(PDF_Url);
              }}
            >
              Downlaod PDF
            </button>
            <button
              className=""
              onClick={() => {
                downloadFileFromUrl(CSV_Url);
              }}
            >
              Downlaod CSV
            </button>
            <button
              className=""
              onClick={() => {
                downloadFileFromUrl(ZIP_Url);
              }}
            >
              Downlaod ZIP
            </button>
          </div>
        </>
      )}
      {!isDownload && (
        <>
          <div className="text-center p-[20px] text-[22px]">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
            {data.length > 0 && (
              <table className="mt-[30px]">
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, index) => (
                        <td key={index}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <br />
            <br />
            <div className="" onClick={handleExport}>
              Download CSV
            </div>
            <div className="flex flex-row gap-2 mt-2">
              <div
                className=" cursor-pointer flex flex-row justify-center items-center bg-mediumspringgreen hover:opacity-90 text-white h-[49px] shrink-0 rounded w-[70%]"
                onClick={() => (window.location.href = downloadLinkRoom)}
              >
                <div className="flex flex-row gap-2">
                  {/* <RxCopy size={15} color="#ffffff" /> */}
                  <div className="leading-[20px] inline-block">Rooms Sheet</div>
                </div>
              </div>

              <div
                className="cursor-pointer flex flex-row justify-center items-center bg-whitesmoke-100 hover:opacity-90 text-mediumspringgreen h-[49px] shrink-0 rounded w-[30%]"
                onClick={() => (window.location.href = downloadLinkSampleRoom)}
              >
                Sample Rooms Sheet
              </div>
            </div>
            ... webstylepress ...
          </div>
        </>
      )}
    </>
  );

  // return (
  //   <div className="flex flex-col md:flex-row justify-center gap-4">
  //     <div className="flex flex-row">{isHome}</div>
  //   </div>
  // );

  return <>{isHome}</>;
};
