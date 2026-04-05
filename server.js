const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL bağlantı tənzimləmələri
const pool = new Pool({
    connectionString: "postgresql://mustafa:pw746TpHwIiUNhFTBvFwhCbRIs0TN5h3@://render.com",
    ssl: { 
        rejectUnauthorized: false 
    }
});


// TƏHLÜKƏSİZ (SECURE) ENDPOINT
app.post('/save-bmi', async (req, res) => {
    // Frontend-dən bütün məlumatları daxil edirik
    const { fullname, age, weight, height, bmi_result } = req.body;
    
    try {
      
        const queryText = 'INSERT INTO users (fullname, age, weight, height, bmi_result) VALUES ($1, $2, $3, $4, $5)';
        const values = [fullname, age, weight, height, bmi_result];
        
        await pool.query(queryText, values);
        
        res.status(200).send("Məlumat təhlükəsiz şəkildə bazaya yazıldı!");
    } catch (err) {
        console.error("Baza xətası:", err);
        res.status(500).send("Xəta baş verdi.");
    }
});

app.listen(3000, () => console.log('Təhlükəsiz Server işləyir: http://localhost:3000'));

