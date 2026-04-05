/**
 * BMI Hesablama və Bazaya Yazma Funksiyası
 */
async function calculateBMI() {
    // Xanalardan dəyərləri götürürük
    const name = document.getElementById('fullname').value;
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const resultElement = document.getElementById('result');

    // 1. Sahələrin boş olub-olmamasını yoxlayırıq
    if (!name || !age || !weight || !height) {
        resultElement.innerHTML = "Zəhmət olmasa bütün xanaları doldurun!";
        resultElement.style.color = "red";
        return;
    }

    // 2. Limitlərin yoxlanılması
    if (weight >= 20 && weight <= 635 && height >= 0.5 && height <= 2.51) {
        
        const bmi = (weight / (height * height)).toFixed(2);
        let message = "";
        let color = "";

        // 3. BMI dərəcəsinə görə status və rəng təyini
        if (bmi < 18.5) {
            message = "Arıq"; color = "#f1c40f"; 
        } else if (bmi < 25) {
            message = "Normal"; color = "#2ecc71"; 
        } else if (bmi < 30) {
            message = "Artıq çəkili"; color = "#e67e22"; 
        } else {
            message = "Piylənmə"; color = "#e74c3c"; 
        }

        // 4. Nəticəni ekranda göstəririk
        resultElement.innerHTML = `BMI: ${bmi} <br> <span style="color: ${color}; font-weight: bold;">(${message})</span>`;
        resultElement.style.color = "#333";

        // 5. Məlumat obyekti
        const userData = {
            fullname: name,
            age: age,
            weight: weight,
            height: height,
            bmi_result: parseFloat(bmi)
        };

        // 6. Serverə göndərmə (Render Linkinlə)
        try {
            const response = await fetch('/save-bmi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                console.log("Məlumat bazaya uğurla yazıldı!");
                resultElement.innerHTML += "<br><small style='color:green;'>Bazaya yazıldı!</small>";
            } else {
                console.error("Bazaya yazılarkən xəta baş verdi.");
            }
        } catch (error) {
            console.error("Serverlə əlaqə kəsildi:", error);
        }
        
    } else {
        resultElement.innerHTML = "Zəhmət olmasa real dəyərlər daxil edin!<br><small>(Çəki: 20-635 kq, Boy: 0.5-2.51 m)</small>";
        resultElement.style.color = "red";
    }
}
