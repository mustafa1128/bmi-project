const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const pool = new Pool({
    connectionString: "postgresql://mustafa:pw746TpHwIiUNhFTBvFwhCbRIs0TN5h3@://render.com",
    ssl: { rejectUnauthorized: false }
});


// Serverin işə düşdüyünü yoxlamaq üçün
console.log("Server başladılır...");

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'bmi.html'));
});

app.post('/save-bmi', async (req, res) => {
    console.log("Məlumat gəldi:", req.body); // Bu mütləq Logs-da görünməlidir
    
    const { fullname, age, weight, height, bmi_result } = req.body;
    
    try {
        const queryText = 'INSERT INTO users (fullname, age, weight, height, bmi_result) VALUES ($1, $2, $3, $4, $5)';
        const values = [fullname, age, weight, height, bmi_result];
        
        await pool.query(queryText, values);
        console.log("Bazaya uğurla yazıldı!"); 
        res.status(200).send("Uğurla yazıldı!");
    } catch (err) {
        console.error("KRİTİK BAZA XƏTASI:", err.message); // Xətanı mütləq bura yazacaq
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda aktivdir.`));

