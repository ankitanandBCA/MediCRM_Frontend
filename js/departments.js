const HOSPITAL_API = "http://localhost:7001/api/hospital";
const DEPARTMENT_API = "http://localhost:7002/api/department";


document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // HTML ELEMENTS
    // ==========================================

    const hospitalSelect =
        document.getElementById("hospitalSelect");

    const hospitalSearch =
        document.getElementById("hospitalSearch");

    const hospitalCount =
        document.getElementById("hospitalCount");

    const selectedHospitalIdElement =
        document.getElementById("selectedHospitalId");

    const hospitalInfo =
        document.getElementById("hospitalInfo");

    const hospitalError =
        document.getElementById("hospitalError");

    const departmentForm =
        document.getElementById("departmentForm");

    const departmentTable =
        document.getElementById("departmentTable");

    const resetBtn =
        document.getElementById("resetBtn");

    const refreshBtn =
        document.getElementById("refreshBtn");


    // ==========================================
    // VARIABLES
    // ==========================================

    let hospitals = [];

    let selectedHospitalId = null;


    // ==========================================
    // LOAD HOSPITALS
    // ==========================================

    async function loadHospitals() {

        try {

            console.log(
                "Hospital API:",
                `${HOSPITAL_API}/all`
            );


            const response =
                await fetch(
                    `${HOSPITAL_API}/all`
                );


            console.log(
                "Hospital Status:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    "Hospital API Error: " +
                    response.status
                );

            }


            hospitals =
                await response.json();


            console.log(
                "Hospital Data:",
                hospitals
            );


            // Hospital count

            if (hospitalCount) {

                hospitalCount.textContent =
                    hospitals.length;

            }


            // Show hospitals

            showHospitals(hospitals);


        } catch (error) {

            console.error(
                "Hospital Load Error:",
                error
            );


            if (hospitalSelect) {

                hospitalSelect.innerHTML = `
                    <option value="">
                        Hospital load nahi hua
                    </option>
                `;

            }

        }

    }


    // ==========================================
    // SHOW HOSPITALS
    // ==========================================

    function showHospitals(list) {

        if (!hospitalSelect) {

            console.error(
                "hospitalSelect nahi mila"
            );

            return;

        }


        // Clear dropdown

        hospitalSelect.innerHTML = "";


        // Default option

        const defaultOption =
            document.createElement("option");

        defaultOption.value = "";

        defaultOption.textContent =
            "Select Hospital";

        hospitalSelect.appendChild(
            defaultOption
        );


        // Hospitals add

        list.forEach(function (hospital) {

            const option =
                document.createElement("option");


            // Backend hospital ID

            option.value =
                hospital.hospitalId;


            // Hospital name

            option.textContent =
                `${hospital.name} (ID: ${hospital.hospitalId})`;


            hospitalSelect.appendChild(
                option
            );

        });


        console.log(
            "Hospitals shown in dropdown"
        );

    }


    // ==========================================
    // SEARCH HOSPITAL
    // ==========================================

    if (hospitalSearch) {

        hospitalSearch.addEventListener(
            "input",
            function () {

                const search =
                    this.value
                        .toLowerCase()
                        .trim();


                const filteredHospitals =
                    hospitals.filter(
                        function (hospital) {

                            return hospital.name
                                .toLowerCase()
                                .includes(search);

                        }
                    );


                showHospitals(
                    filteredHospitals
                );

            }
        );

    }


    // ==========================================
    // SELECT HOSPITAL
    // ==========================================

    if (hospitalSelect) {

        hospitalSelect.addEventListener(
            "change",
            function () {

                const hospitalId =
                    this.value;


                console.log(
                    "Selected Hospital:",
                    hospitalId
                );


                // No hospital selected

                if (!hospitalId) {

                    selectedHospitalId =
                        null;


                    if (selectedHospitalIdElement) {

                        selectedHospitalIdElement.textContent =
                            "-";

                    }


                    if (hospitalInfo) {

                        hospitalInfo.classList.add(
                            "hidden"
                        );

                    }


                    return;

                }


                // Store hospital ID

                selectedHospitalId =
                    Number(hospitalId);


                console.log(
                    "Selected Hospital ID:",
                    selectedHospitalId
                );


                // Show hospital ID

                if (selectedHospitalIdElement) {

                    selectedHospitalIdElement.textContent =
                        selectedHospitalId;

                }


                // Show hospital info

                if (hospitalInfo) {

                    hospitalInfo.classList.remove(
                        "hidden"
                    );

                }


                // Clear error

                if (hospitalError) {

                    hospitalError.textContent =
                        "";

                }


                // Load departments

                loadDepartments(
                    selectedHospitalId
                );

            }
        );

    }


    // ==========================================
    // ADD DEPARTMENT
    // ==========================================

    if (departmentForm) {

        departmentForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                // ==================================
                // CHECK HOSPITAL
                // ==================================

                if (
                    !selectedHospitalId ||
                    isNaN(selectedHospitalId)
                ) {

                    alert(
                        "Please select hospital first"
                    );

                    return;

                }


                // ==================================
                // GET DEPARTMENT DATA
                // ==================================

                const nameElement =
                    document.getElementById(
                        "name"
                    );


                const descriptionElement =
                    document.getElementById(
                        "description"
                    );


                const name =
                    nameElement.value.trim();


                const description =
                    descriptionElement.value.trim();


                // ==================================
                // VALIDATE DEPARTMENT NAME
                // ==================================

                if (!name) {

                    alert(
                        "Please enter department name"
                    );

                    return;

                }


                // ==================================
                // CREATE JSON
                // ==================================

                const departmentData = {

                    name: name,

                    description: description,

                    hospitalId:
                        Number(
                            selectedHospitalId
                        )

                };


                console.log(
                    "Sending Data:",
                    departmentData
                );


                // ==================================
                // POST DEPARTMENT
                // ==================================

                try {

                    const response =
                        await fetch(
                            `${DEPARTMENT_API}/add`,
                            {

                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        departmentData
                                    )

                            }
                        );


                    console.log(
                        "Department Status:",
                        response.status
                    );


                    // Backend response

                    const responseText =
                        await response.text();


                    console.log(
                        "Backend Response:",
                        responseText
                    );


                    // ==================================
                    // ERROR
                    // ==================================

                    if (!response.ok) {

                        alert(
                            "Department add nahi hua!\n\n" +
                            "Status: " +
                            response.status +
                            "\n\n" +
                            responseText
                        );

                        return;

                    }


                    // ==================================
                    // SUCCESS
                    // ==================================

                    alert(
                        "Department added successfully!"
                    );


                    // ==================================
                    // CLEAR FORM
                    // ==================================

                    nameElement.value = "";

                    descriptionElement.value = "";


                    // ==================================
                    // RELOAD DEPARTMENTS
                    // ==================================

                    loadDepartments(
                        selectedHospitalId
                    );


                } catch (error) {

                    console.error(
                        "Department Add Error:",
                        error
                    );


                    alert(
                        "API call failed!\n\n" +
                        error.message
                    );

                }

            }
        );

    }


    // ==========================================
    // LOAD DEPARTMENTS
    // ==========================================

    async function loadDepartments(
        hospitalId
    ) {

        try {

            console.log(
                "Department API:",
                `${DEPARTMENT_API}/${hospitalId}`
            );


            const response =
                await fetch(
                    `${DEPARTMENT_API}/${hospitalId}`
                );


            console.log(
                "Department Status:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    "Department API Error: " +
                    response.status
                );

            }


            const departments =
                await response.json();


            console.log(
                "Department Data:",
                departments
            );


            if (!departmentTable) {

                return;

            }


            departmentTable.innerHTML = "";


            // ==================================
            // NO DEPARTMENT
            // ==================================

            if (
                !departments ||
                departments.length === 0
            ) {

                departmentTable.innerHTML = `
                    <tr>

                        <td
                            colspan="4"
                            class="empty">

                            No departments found.

                        </td>

                    </tr>
                `;

                return;

            }


            // ==================================
            // SHOW DEPARTMENTS
            // ==================================

            departments.forEach(
                function (dept) {

                    departmentTable.innerHTML += `
                        <tr>

                            <td>
                                ${dept.deptId}
                            </td>

                            <td>
                                ${dept.name}
                            </td>

                            <td>
                                ${dept.description || ""}
                            </td>

                            <td>
                                ${dept.hospitalId}
                            </td>

                        </tr>
                    `;

                }
            );


        } catch (error) {

            console.error(
                "Department Load Error:",
                error
            );


            if (departmentTable) {

                departmentTable.innerHTML = `
                    <tr>

                        <td
                            colspan="4"
                            class="empty">

                            Department load nahi hua.

                        </td>

                    </tr>
                `;

            }

        }

    }


    // ==========================================
    // RESET BUTTON
    // ==========================================

    if (resetBtn) {

        resetBtn.addEventListener(
            "click",
            function () {


                const nameElement =
                    document.getElementById(
                        "name"
                    );


                const descriptionElement =
                    document.getElementById(
                        "description"
                    );


                if (nameElement) {

                    nameElement.value = "";

                }


                if (descriptionElement) {

                    descriptionElement.value = "";

                }


                if (hospitalSelect) {

                    hospitalSelect.value = "";

                }


                selectedHospitalId =
                    null;


                if (selectedHospitalIdElement) {

                    selectedHospitalIdElement.textContent =
                        "-";

                }


                if (hospitalInfo) {

                    hospitalInfo.classList.add(
                        "hidden"
                    );

                }


                if (departmentTable) {

                    departmentTable.innerHTML = `
                        <tr>

                            <td
                                colspan="4"
                                class="empty">

                                Select a hospital to view departments.

                            </td>

                        </tr>
                    `;

                }

            }
        );

    }


    // ==========================================
    // REFRESH BUTTON
    // ==========================================

    if (refreshBtn) {

        refreshBtn.addEventListener(
            "click",
            function () {

                loadHospitals();


                if (selectedHospitalId) {

                    loadDepartments(
                        selectedHospitalId
                    );

                }

            }
        );

    }


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    loadHospitals();

});