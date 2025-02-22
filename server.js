const http=require("http");
// console.log(http);
const server=http.createServer((req,res)=>{
    // console.log(req);
    res.end("g24 batch acha h");
});

server.listen(3000,()=>{
    console.log("server is listening");
});