const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer');
const port = 3000;
const app = express();
const { engine } = require('express-handlebars');


//mongoose db connection

const mongoose = require('mongoose');


const url = 'mongodb+srv://huynvph20687:c1sas2Dnu6fPDo6F@mongo-huynvph20687.f01mcft.mongodb.net/hoctap?retryWrites=true&w=majority';
const {ipModel} = require('./sqlmodel');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.json())
app.engine('handlebars', engine({ extname: '.hbs', defaultLayout: "main" }));
app.set('view engine', 'hbs');
const fs = require('fs');
  const content = fs.readFileSync('index.txt', 'utf-8');
  const lines = content.split('\n');
  const emails = lines.map(line => line.split('|')[0]); 
app.get('/', async (req, res) => {
  res.redirect('ip')
});
app.get('/ip', async (req, res) => {
    await mongoose.connect(url).then(console.log('kets noi db thanh cong'));
    const ip = await ipModel.find();
    res.render('home',{allip : ip.map(data=>data.toJSON()),emails});
    for(let i=0;i<ip.length;i++){
        let s=ip[i];
        console.log("ip thứ :",i+1);
        console.log("tên sách: "+s.tenip)
    }

    try {
        console.log(ip);
        
       

    } catch (e) {
        res.status(500).send(e);
    }
});
app.get('/search_ip', async (req, res) => {
    try {
      const query = req.query.search;
      console.log(query);
      if(query==''){
        let ip = await ipModel.find();
        res.render('home',{allip : ip.map(data=>data.toJSON()),emails});
      }
      else{
        let Addressip = await ipModel.find({Addressip:query});
        res.render('home',{allip : Addressip.map(data=>data.toJSON()),emails});
        console.log(Addressip)
      }
      
    } catch (error) {
      res.status(500).send(error);
    }
  });
 
  app.post('/updateEmails', (req, res) => {
    // Lấy nội dung của file index.txt
    const content = fs.readFileSync('index.txt', 'utf-8');
    // Chuyển nội dung thành mảng các dòng
    const lines = content.split('\n');
    // Loại bỏ dòng đầu tiên khỏi mảng
    lines.shift();
    // Ghi lại nội dung mới vào file index.txt
    fs.writeFileSync('index.txt', lines.join('\n'));
  
    // Chuyển hướng về trang chủ
    res.redirect('/ip');
  });
  app.get('/getEmails', async (req, res) => {

    const content = fs.readFileSync('index.txt', 'utf-8');
  const lines = content.split('\n');
  const emails = lines.map(line => line.split('|')[0]); 
  let ip = await ipModel.find();
  res.render('home',{allip : ip.map(data=>data.toJSON()),emails});
  });
  
app.get("/update_ip/:id", async (request, response) => {

    await mongoose.connect(url).then(console.log('Ket noi DB thanh cong.'));

    try {
        var kq = await ipModel.findById(request.params.id);

        console.log(kq);
        response.render('quanlyip',{object:kq.toJSON(),emails});
        //await ip.save();
        // response.send(kq);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/xoa_ip/:id", async (request, response) => {

    await mongoose.connect(url).then(console.log('Ket noi DB thanh cong.'));

    try {
        var kq = await ipModel.findByIdAndDelete(request.params.id, request.body);

        console.log(kq);  
        response.redirect('/ip');
        //await ip.save();
        // response.send(kq);
    } catch (error) {
        response.status(500).send(error);
    }
});


app.get('/quanlyip', (req, res) => {
    res.render('quanlyip',{emails});
});
app.post("/quanlyip", async (req, res) => {
    console.log(req.body.Addressip);
    if (req.body.id == '') {
        try {
            ipModel.create(req.body)
                .then(data => {
                    
                })
                .catch(err => console.log(err));
                res.redirect('/ip');
        } catch (error) {
            console.log(error);
        }
        res.render('quanlyip',{emails});
    } else {
        await ipModel.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true });
        res.redirect('/ip');
    }
});

app.listen(port, () => console.log('Server started on port 3000'));
