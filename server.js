const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path'); // Dosya yollarını yönetmek için gerekli

const app = express();
app.use(cors());
app.use(express.json());

// 1. STATİK DOSYALARI PAYLAŞ: Bu satır sayfanın internette görünmesini sağlar
app.use(express.static(__dirname));

// PostgreSQL bağlantı ayarları
const pool = new Pool({
    // Buradaki linki Render'daki "External Database URL" ile tam olarak değiştirin
    connectionString: "postgresql://mustafa:pw746TpHwIiUNhFTBvFwhCbRIs0TN5h3@://render.com",
    ssl: { 
        rejectUnauthorized: false 
    }
});

// 2. ANA SAYFA ROTASI: Linke tıklandığında BMI sayfasını açar
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'bmi.html'));
});

// BMI Verilerini Kaydetme (Təhlükəsiz Endpoint)
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

// Render için dinamik port ayarı (Önemli!)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda işləyir`));
