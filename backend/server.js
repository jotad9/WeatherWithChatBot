const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const app = express();
//server: localhost
//para usar docker: host.docker.internal
const config = {
    user: 'admin',
    password: 'admin',
    server: 'host.docker.internal',
    database: 'weather',
    options:{
        trustServerCertificate: true
    }
};
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

app.use(cors());
app.use(express.json());
app.post('/register', async (req, res) => {
    try {
        await poolConnect;
        const result = await pool.request()
            .input('Nombre', sql.NVarChar, req.body.name)
            .input('email', sql.NVarChar, req.body.email)
            .input('password', sql.NVarChar, req.body.password)
            .input('city', sql.NVarChar, req.body.city)
            .input('edad', sql.Int, req.body.age)
            .query('INSERT INTO profile (Nombre, email, password, city, edad) VALUES (@Nombre, @email, @password, @city, @edad)');

        if (result.rowsAffected[0] > 0) {
            res.status(200).send({
                message: 'Registro exitoso',
            });
        } else {
            // handle case where no rows were inserted
        }
    } catch (err) {
        // handle error
    }
});
//Usa req.body cuando los datos se envían en el cuerpo de la solicitud, típicamente en solicitudes POST, PUT, PATCH.
app.post('/login', async (req, res) => {
    try {
        await poolConnect;
        const result = await pool.request()
            .input('Nombre', sql.NVarChar, req.body.name)
            .input('password', sql.NVarChar, req.body.password)
            .query('SELECT * FROM profile WHERE Nombre = @Nombre AND password = @password');

        if (result.recordset.length > 0) {
            const user = result.recordset[0]; 
            res.status(200).send({
                message: 'Logged in',
                user: {
                    name: user.Nombre, // Convert 'Nombre' to 'name'
                    email: user.email,
                    password: user.password,
                    city: user.city,
                    age: user.edad
                }
            });
        } 
    } catch (err) {
        console.error('SQL error', err);
        return false;
    }
});
//Usa req.query cuando los datos se envían como parámetros de consulta en la URL, típicamente en solicitudes GET.
app.get('/historial', async (req, res) => {
    try {
        await poolConnect;
        const result = await pool.request()
            .input('Nombre', sql.NVarChar, req.query.Nombre)
            .query('SELECT * FROM Historicos WHERE Nombre = @Nombre');

        if (result.recordset.length > 0) {
            const user = result.recordset;
            res.status(200).send({
                message: 'Historial encontrado',
                user: user.map(u => ({
                    name: u.Nombre,
                    historial: u.SearchCity,
                    fecha: u.Fecha
                }))
            });
        } else {
            res.status(404).send({
                message: 'Historial no encontrado'
            });
        }
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send({
            message: 'Server error'
        });
    }
});

app.post('/registroHistorial', async (req, res) => {
    try {
        await poolConnect;
        const result = await pool.request()
            .input('Nombre', sql.NVarChar, req.body.Nombre)
            .input('SearchCity', sql.NVarChar, req.body.SearchCity)
            .input('Fecha', sql.DateTime,req.body.Fecha)
            .query('INSERT INTO Historicos (Nombre, SearchCity,Fecha) VALUES (@Nombre, @SearchCity,@Fecha)');

        if (result.recordset && result.recordset.length > 0) {
            //const user recoge la información del usuario
            res.status(200).send({
                message: 'Ciudad añadida al historial',
                //Se envía la información del usuario
                user: {
                    name: req.body.Nombre,
                    historial: req.body.SearchCity,
                    fecha:req.body.Fecha
                }
            });
        }
    } catch (error) {
        console.error('SQL error', error);
        res.status(500).send({
            message: 'Server error'
        });
    }
});

const port= 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});