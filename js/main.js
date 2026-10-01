function hospitalRegis()
{
    window.location.href="HospitalRegistration.html";
}





const form = document.getElementById("hospitalForm");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    // Frontend se values lena
    const hospitalName = document.getElementById("hospitalName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phoneNo = document.getElementById("phoneNo").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const licenseNo = document.getElementById("licenseNo").value.trim();
    const gstNo = document.getElementById("gstNo").value.trim();
 


    const hospitalData = {

        name: hospitalName,

        email: email,

        phone: phoneNo,

        address: address,

        city: city,

        state: state,

        pincode: pincode,

        gstno: gstNo,

        licanceNo: licenseNo
       
    };


    try {

        const response = await fetch("http://localhost:7001/api/hospital/add", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(hospitalData)
        });


        if (!response.ok) {

            throw new Error("Hospital registration failed");

        }


        const result = await response.json();

        console.log("Backend Response:", result);


        alert("Hospital Registered Successfully!");

        form.reset();


    } catch (error) {

        console.error("Error:", error);

        alert("Failed to register hospital. Please try again.");

    }

});


