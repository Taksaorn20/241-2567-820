// import http module เพื่อสร้าง server
const http = require('http');

const host = 'localhost'; // กำหนด host ที่ server จะรอรับ request
const port = 8000; // กำหนด port ที่ server จะรอรับ request

// กำหนดค่าเริ่มต้นของ server
const requestListener = function (req, res) {
  res.writeHead(200); // ส่ง status code 200 กลับไปให้ client
  res.end('My first server!'); // ส่ง response กลับไปให้ client
}

const server = http.createServer(requestListener); // สร้าง server ด้วย http.createServer โดยใช้ requestListener ที่เราสร้างไว้
server.listen(port, host, () => { // กำหนดให้ server รอรับ request ที่ port 8000 และ host ที่เรากำหนดไว้
    console.log(`Server is running on http://${host}:${port}`); // แสดงข้อความว่า server กำลังทำงานอยู่ที่ http://localhost:8000
});