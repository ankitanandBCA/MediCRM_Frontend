// ==========================================
// MEDICINE SERVICE
// ==========================================

const MEDICINE_API =
    "http://localhost:7005/api/medicin";


document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ==========================================
        // HTML ELEMENTS
        // ==========================================

        const medicineForm =
            document.getElementById("medicineForm");

        const medicineTable =
            document.getElementById("medicineTable");

        const hospitalIdText =
            document.getElementById("hospitalIdText");

        const hospitalIdElement =
            document.getElementById("hospitalId");

        const resetBtn =
            document.getElementById("resetBtn");

        const refreshBtn =
            document.getElementById("refreshBtn");

        const logoutBtn =
            document.getElementById("logoutBtn");


        // ==========================================
        // GET LOGGED-IN HOSPITAL ID
        // ==========================================

        const savedHospitalId =
            localStorage.getItem("hospitalId");


        if (!savedHospitalId) {

            alert(
                "Hospital login nahi mila. Please login first."
            );

            return;

        }


        const hospitalId =
            Number(savedHospitalId);


        console.log(
            "Logged-in Hospital ID:",
            hospitalId
        );


        // ==========================================
        // SHOW HOSPITAL ID
        // ==========================================

        hospitalIdText.textContent =
            hospitalId;

        hospitalIdElement.textContent =
            hospitalId;



        // ==========================================
        // LOAD MEDICINES
        // ONLY LOGGED-IN HOSPITAL
        // ==========================================

        async function loadMedicines() {

            try {

                console.log(
                    "Medicine API:",
                    `${MEDICINE_API}/hosp/${hospitalId}`
                );


                const response =
                    await fetch(
                        `${MEDICINE_API}/hosp/${hospitalId}`
                    );


                console.log(
                    "Medicine Status:",
                    response.status
                );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        "Status: " +
                        response.status +
                        " " +
                        errorText
                    );

                }


                const medicines =
                    await response.json();


                console.log(
                    "Hospital Medicines:",
                    medicines
                );


                medicineTable.innerHTML =
                    "";


                // ==================================
                // NO MEDICINE
                // ==================================

                if (
                    !medicines ||
                    medicines.length === 0
                ) {

                    medicineTable.innerHTML = `

                        <tr>

                            <td
                                colspan="9"
                                class="empty">

                                No medicines found
                                for this hospital.

                            </td>

                        </tr>

                    `;

                    return;

                }



                // ==================================
                // SHOW MEDICINES
                // ==================================

                medicines.forEach(
                    function (medicine) {


                        let statusClass =
                            "status-inactive";


                        if (
                            medicine.status ===
                            "ACTIVE"
                        ) {

                            statusClass =
                                "status-active";

                        }


                        medicineTable.innerHTML += `

                            <tr>

                                <td>
                                    ${medicine.medicinId}
                                </td>


                                <td>
                                    <strong>
                                        ${medicine.name}
                                    </strong>
                                </td>


                                <td>
                                    ${medicine.description || ""}
                                </td>


                                <td>
                                    ${medicine.quantity}
                                </td>


                                <td>
                                    ₹${medicine.price}
                                </td>


                                <td>
                                    ${medicine.category}
                                </td>


                                <td>

                                    <span
                                        class="${statusClass}">

                                        ${medicine.status}

                                    </span>

                                </td>


                                <td>
                                    ${medicine.hospitalId}
                                </td>


                                <td>

                                    <button
                                        class="delete-btn"
                                        onclick="deleteMedicine(${medicine.medicinId})">

                                        Delete

                                    </button>

                                </td>

                            </tr>

                        `;

                    }
                );


            }
            catch (error) {

                console.error(
                    "Medicine Load Error:",
                    error
                );


                medicineTable.innerHTML = `

                    <tr>

                        <td
                            colspan="9"
                            class="empty">

                            Medicine load nahi hua.

                        </td>

                    </tr>

                `;

            }

        }



        // ==========================================
        // ADD MEDICINE
        // ==========================================

        medicineForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                // ==================================
                // GET FORM VALUES
                // ==================================

                const name =
                    document.getElementById(
                        "name"
                    ).value.trim();


                const description =
                    document.getElementById(
                        "description"
                    ).value.trim();


                const quantity =
                    document.getElementById(
                        "quantity"
                    ).value;


                const price =
                    document.getElementById(
                        "price"
                    ).value;


                const category =
                    document.getElementById(
                        "category"
                    ).value;


                const status =
                    document.getElementById(
                        "status"
                    ).value;



                // ==================================
                // CREATE JSON
                // ==================================

                const medicineData = {

                    name: name,

                    description: description,

                    quantity:
                        Number(quantity),

                    price:
                        Number(price),

                    category: category,

                    status: status,

                    // IMPORTANT
                    // Logged-in hospital ID
                    hospitalId: hospitalId

                };


                console.log(
                    "Medicine Data:",
                    medicineData
                );



                // ==================================
                // POST REQUEST
                // ==================================

                try {

                    const response =
                        await fetch(
                            `${MEDICINE_API}/add`,
                            {

                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        medicineData
                                    )

                            }
                        );


                    const responseText =
                        await response.text();


                    console.log(
                        "Backend Response:",
                        responseText
                    );


                    if (!response.ok) {

                        alert(
                            "Medicine add nahi hui!\n\n" +
                            "Status: " +
                            response.status +
                            "\n\n" +
                            responseText
                        );

                        return;

                    }


                    alert(
                        "Medicine added successfully!"
                    );


                    // ==================================
                    // RESET FORM
                    // ==================================

                    medicineForm.reset();


                    // ==================================
                    // LOAD UPDATED LIST
                    // ==================================

                    loadMedicines();


                }
                catch (error) {

                    console.error(
                        "Medicine Add Error:",
                        error
                    );


                    alert(
                        "Medicine API call failed!\n\n" +
                        error.message
                    );

                }

            }
        );



        // ==========================================
        // DELETE MEDICINE
        // ==========================================

        window.deleteMedicine =
            async function (medicinId) {


                const confirmDelete =
                    confirm(
                        "Kya aap ye medicine delete karna chahte hain?"
                    );


                if (!confirmDelete) {
                    return;
                }


                try {

                    const response =
                        await fetch(
                            `${MEDICINE_API}/delete/${medicinId}`,
                            {

                                method: "DELETE"

                            }
                        );


                    const responseText =
                        await response.text();


                    console.log(
                        "Delete Response:",
                        responseText
                    );


                    if (!response.ok) {

                        alert(
                            "Medicine delete nahi hui!\n\n" +
                            responseText
                        );

                        return;

                    }


                    alert(
                        "Medicine deleted successfully!"
                    );


                    loadMedicines();


                }
                catch (error) {

                    console.error(
                        "Delete Error:",
                        error
                    );


                    alert(
                        "Delete API call failed!\n\n" +
                        error.message
                    );

                }

            };



        // ==========================================
        // RESET
        // ==========================================

        resetBtn.addEventListener(
            "click",
            function () {

                medicineForm.reset();

            }
        );



        // ==========================================
        // REFRESH
        // ==========================================

        refreshBtn.addEventListener(
            "click",
            function () {

                loadMedicines();

            }
        );



        // ==========================================
        // LOGOUT
        // ==========================================

        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                function () {

                    localStorage.removeItem(
                        "hospitalId"
                    );

                    window.location.href =
                        "login.html";

                }
            );

        }



        // ==========================================
        // INITIAL LOAD
        // ==========================================

        loadMedicines();

    }
);