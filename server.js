const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Statik dosyaları (HTML, CSS, JS) dışarı açar
app.use(express.static(__dirname));

// DOĞRU BAĞLANTI BURADA: Senin özel Render linkini buraya tam olarak yazdım
const pool = new Pool({
    connectionString: "postgresql://mustafa:pw746TpHwIiUNhFTBvFwhCbRIs0TN5h3@://render.com",
    ssl: { 
        rejectUnauthorized: false 
    }
});

// Ana sayfaya girince bmi.html dosyasını gösterir
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'bmi.html'));
});

// Verileri veritabanına kaydeden kısım
app.post('/save-bmi', async (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda işləyir`));

