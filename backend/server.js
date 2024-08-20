const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.post('/register', async (req, res) => {
    try {
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
async function checkUserCredentials(username, password) {
    try {
        const result = await pool.request()
            .input('Nombre', sql.NVarChar, username)
            .input('password', sql.NVarChar, password)
            .query('SELECT * FROM profile WHERE Nombre = @Nombre AND password = @password');

        if (result.recordset.length > 0) {
            return true;
        } else {
            return null;
        }
    } catch (err) {
        console.error('SQL error', err);
        return false;
    }
}
app.post('/login', async (req, res) => {
    const {
        username,
        password
    } = req.body;

    // Aquí deberías verificar el nombre de usuario y la contraseña con tu base de datos
    const user = await checkUserCredentials(username, password);

    if (user) {
        // Si el usuario es válido, almacena su información en la sesión
        req.session.user = user;
        res.status(200).send({
            message: 'Logged in'
        });
    } else {
        res.status(401).send({
            message: 'Invalid credentials'
        });
    }
});

app.get('/historial', async (req, res) => {
    try {
        const result = await pool.request()
            .input('Nombre', sql.NVarChar, req.query.Nombre)
            .query('SELECT * FROM Historicos WHERE Nombre = @Nombre');

        if (result.recordset.length > 0) {
            const user = result.recordset;
            res.status(200).send({
                message: 'Historial encontrado',
                user: user.map(u => ({
                    name: u.Nombre,
                    historial: u.SearchCity
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
        const result = await pool.request()
            .input('Nombre', sql.NVarChar, req.body.Nombre)
            .input('SearchCity', sql.NVarChar, req.body.SearchCity)
            .query('INSERT INTO Historicos (Nombre, SearchCity) VALUES (@Nombre, @SearchCity)');

        if (result.recordset && result.recordset.length > 0) {
            //const user recoge la información del usuario
            res.status(200).send({
                message: 'Ciudad añadida al historial',
                //Se envía la información del usuario
                user: {
                    name: req.body.Nombre,
                    historial: req.body.SearchCity
                }
            });
        }
    } catch (error) {
        // handle error
    }
});