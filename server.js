//zmienne, stałe
var express = require("express");
const { dirname } = require("path");
var app = express()
const PORT = 3000;
var logged = false
var istnieje = false
var bodyParser = require("body-parser");
const { table } = require("console");
//nasłuch na określonym porcie
app.listen(PORT, function () { 
    console.log("start serwera na porcie " + PORT )
})
app.use(express.static('css'))

app.use(bodyParser.urlencoded({ extended: true })); 

var users = [
    { id: 1, login: "AAA", password: "PASS1", wiek: 10, uczen: "checked", plec: "m" },
    { id: 2, login: "Martyna", password: "123", wiek: 9, uczen: "", plec: "k" },
    { id: 3, login: "Stas", password: "123", wiek: 20, uczen: "checked", plec: "m" },
    { id: 4, login: "Jola", password: "123", wiek: 17, uczen: "", plec: "k" },
    { id: 5, login: "Kacper", password: "123", wiek: 19, uczen: "checked", plec: "m" },
]
//------------------------------MAIN PAGE----------------------------
app.get('/', function(req, res){
    if(logged){
        res.sendFile(__dirname + '/sites/logged/main.html')
    }else{
        res.sendFile(__dirname + '/sites/main.html')
    }
})
//-------------------------------REGISTER----------------------------
app.get('/register', function(req, res){
    if(logged){
        res.sendFile(__dirname + '/sites/logged/register.html')
    }else{
        res.sendFile(__dirname + '/sites/register.html')
    }   
})
app.post('/register', function(req, res){
   newuser = req.body
   newuser.id = users.length + 1
   newuser.wiek = parseInt(newuser.wiek)
   if(newuser.uczen == 'on'){
        newuser.uczen = 'checked'
    }else{
        newuser.uczen = ''
    }
   users.forEach(function(olduser){
       if(newuser.login == olduser.login){
           res.send('Uzytkownik o takim loginie juz istnieje')
           istnieje = true
       }
   })
   if(istnieje == false){
        users.push(newuser)
        res.send(`Witaj ${newuser.login} zostałeś zajerestrowany`)
   }
})

//-------------------------------LOGIN----------------------------
app.get('/login', function(req, res){
    if(logged){
        res.sendFile(__dirname + '/sites/logged/login.html')
    }else{
        res.sendFile(__dirname + '/sites/login.html')
    }
})
app.post('/login', function(req,res){
    userlog = req.body
    users.forEach(function(user){
        if(userlog.login == user.login && userlog.password == user.password){
            logged = true;
            res.redirect('/admin')
        }
    })
    if(!logged){
        res.send('Błedna nazwa uzytkownika lub haslo')
    }
})
//----------------------------ADMIN--------------------------------
app.get('/admin', function(req, res){
    if(logged){
        res.sendFile(__dirname + '/sites/logged/admin.html')
    }else{
        res.sendFile(__dirname + '/sites/admin.html')
    }
})
//----------------------------SHOW--------------------------------
app.get('/show',function(req,res){
    all = ''

    sortedbyid = users.sort( (a,b) => a.id - b.id ); 
    sortedbyid.forEach(function(user){
        row = `<tr>
            <td>id: ${user.id}</td>
            <td>user: ${user.login} - ${user.password} </td>
            <td>uczen:  <input type="checkbox" disabled ${user.uczen ? 'checked' : ''}></td> </td>
            <td>wiek: ${user.wiek}</td>
            <td>płeć: ${user.plec}</td>
        </tr>`
        all += row
    })

    if(!logged){
        res.sendFile(__dirname + '/sites/admin.html')
    }else{
        
        res.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Main</title>
            <link rel='stylesheet' href="style.css">
        </head>
        <body class="dark">
            <div class='adminpages'>
                <a href="/sort">sort</a>
                <a href="/gender">gender</a>
                <a href="/show">show</a>
            </div>

            <table class='output'>
                ${all}
            </table>
        </body>
        </html>`)}
})
//------------------------------------------GENDER-------------------------
app.get('/gender', function(req,res){
    men = []
    women = []
    allwomen = ''
    allmen = ''
    users.forEach(function(user){
        if(user.plec == 'm'){
            men.push(user)
        }else{
            women.push(user)
        }
    })
    womenbyid = women.sort( (a,b) => a.id - b.id );
    menbyid = men.sort( (a,b) => a.id - b.id );

    womenbyid.forEach(function(user){
        rowwomen = `<tr>
            <td>id: ${user.id}</td>
            <td>płeć: ${user.plec}</td>
        </tr>`
        allwomen += rowwomen
    })
    menbyid.forEach(function(user){
        rowmen = `<tr>
            <td>id: ${user.id}</td>
            <td>płeć: ${user.plec}</td>
        </tr>`
        allmen += rowmen
    })
    if(!logged){
        res.sendFile(__dirname + '/sites/admin.html')
    }else{
        
        res.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Main</title>
            <link rel='stylesheet' href="style.css">
        </head>
        <body class="dark">
            <div class='adminpages'>
                <a href="/sort">sort</a>
                <a href="/gender">gender</a>
                <a href="/show">show</a>
            </div>

            <table class='output gender'>
                ${allwomen}
            </table>
            <table class='output gender'>
            ${allmen}
        </table>
        </body>
        </html>`)}
})
//----------------------------------------SORT-------------------------------
app.get('/sort',function(req,res){
    all = ''
    sortedbyage = users.sort( (a,b) => a.id - b.id );
    sortedbyage.forEach(function(user){
        row = `<tr>
            <td>id: ${user.id}</td>
            <td>user: ${user.login} - ${user.password} </td>
            <td>wiek: ${user.wiek}</td>
        </tr>`
        all += row
    })
    if(!logged){
        res.sendFile(__dirname + '/sites/admin.html')
    }else{
        res.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Main</title>
            <link rel='stylesheet' href="style.css">
        </head>
        <body class="dark">
            <div class='adminpages'>
                <a href="/sort">sort</a>
                <a href="/gender">gender</a>
                <a href="/show">show</a>
            </div>
            <form class='showinputs' method='POST' onchange="this.submit()">
                <label>
                    <input type='radio' name='sort' value='rosnaco' id='rosnaco'  checked>Rosnąco
                    <input type='radio' name='sort' value='malejaco' id='malejaco'  >Malejąco
                </label>
                <label></label>
            </form>
            <table class='output'>
               ${all}
            </table>
        </body>
        </html>`)}
})
app.post('/sort',function(req,res){
    //-----------------------------------POST - ROSNACO---------------------------
    if(req.body.sort == 'rosnaco'){
        all = ''
    sortedbyage = users.sort( (a,b) => a.wiek - b.wiek );
    sortedbyage.forEach(function(user){
        row = `<tr>
            <td>id: ${user.id}</td>
            <td>user: ${user.login} - ${user.password} </td>
            <td>wiek: ${user.wiek}</td>
        </tr>`
        all += row
    })
    if(!logged){
        res.sendFile(__dirname + '/sites/admin.html')
    }else{
        res.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Main</title>
            <link rel='stylesheet' href="style.css">
        </head>
        <body class="dark">
            <div class='adminpages'>
                <a href="/sort">sort</a>
                <a href="/gender">gender</a>
                <a href="/show">show</a>
            </div>
            <form class='showinputs' method='POST' onchange="this.submit()">
                <label>
                    <input type='radio' name='sort' value='rosnaco' id='rosnaco'  checked>Rosnąco
                    <input type='radio' name='sort' value='malejaco' id='malejaco'  >Malejąco
                </label>
                <label></label>
            </form>
            <table class='output'>
               ${all}
            </table>
        </body>
        </html>`)}
    }
    //----------------------------------------POST - MALEJACO--------------------
    else if (req.body.sort == 'malejaco'){
        all = ''
    sortedbyage = users.sort( (a,b) => b.wiek - a.wiek );
    sortedbyage.forEach(function(user){
        row = `<tr>
            <td>id: ${user.id}</td>
            <td>user: ${user.login} - ${user.password} </td>
            <td>wiek: ${user.wiek}</td>
        </tr>`
        all += row
    })
    if(!logged){
        res.sendFile(__dirname + '/sites/admin.html')
    }else{
        res.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Main</title>
            <link rel='stylesheet' href="style.css">
        </head>
        <body class="dark">
            <div class='adminpages'>
                <a href="/sort">sort</a>
                <a href="/gender">gender</a>
                <a href="/show">show</a>
            </div>
            <form class='showinputs' method='POST' onchange="this.submit()">
                <label>
                    <input type='radio' name='sort' value='rosnaco' id='rosnaco'  >Rosnąco
                    <input type='radio' name='sort' value='malejaco' id='malejaco'  checked>Malejąco
                </label>
                <label></label>
            </form>
            <table class='output'>
               ${all}
            </table>
        </body>
        </html>`)}
    }
})
app.get('/logout',function(req,res){
    logged = false
    res.redirect('/')
})