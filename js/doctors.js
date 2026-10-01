const DEPARTMENT_API =
    "http://localhost:7002/api/department";

const DOCTOR_API =
    "http://localhost:7003/api/doctor";


document.addEventListener("DOMContentLoaded", function () {


    // ==========================================
    // ELEMENTS
    // ==========================================

    const hospitalIdText =
        document.getElementById("hospitalIdText");

    const departmentSelect =
        document.getElementById("departmentSelect");

    const departmentIdText =
        document.getElementById("departmentIdText");

    const doctorForm =
        document.getElementById("doctorForm");

    const doctorTable =
        document.getElementById("doctorTable");

    const resetBtn =
        document.getElementById("resetBtn");

    const refreshBtn =
        document.getElementById("refreshBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");


    // ==========================================
    // VARIABLES
    // ==========================================

    let hospitalId = null;

    let deptId = null;



    // ==========================================
    // GET LOGGED-IN HOSPITAL
    // ==========================================

    function getLoggedInHospital() {

        const savedHospitalId =
            localStorage.getItem("hospitalId");


        console.log(
            "Hospital ID from LocalStorage:",
            savedHospitalId
        );


        if (!savedHospitalId) {

            alert(
                "Hospital login nahi mila. Please login first."
            );

            return null;
        }


        return Number(savedHospitalId);

    }



    // ==========================================
    // LOAD DEPARTMENTS
    // ONLY CURRENT HOSPITAL
    // ==========================================

    async function loadDepartments() {

        if (!hospitalId) {
            return;
        }


        try {

            const url =
                `${DEPARTMENT_API}/${hospitalId}`;


            console.log(
                "Department API:",
                url
            );


            const response =
                await fetch(url);


            console.log(
                "Department Status:",
                response.status
            );


            if (!response.ok) {

                const errorText =
                    await response.text();


                throw new Error(
                    "Department API Error: " +
                    response.status +
                    " " +
                    errorText
                );

            }


            const departments =
                await response.json();


            console.log(
                "Departments:",
                departments
            );


            departmentSelect.innerHTML = `
                <option value="">
                    Select Department
                </option>
            `;


            departments.forEach(
                function (department) {


                    const option =
                        document.createElement(
                            "option"
                        );


                    /*
                     * Backend Department Entity:
                     *
                     * deptId
                     */

                    option.value =
                        department.deptId;


                    option.textContent =
                        department.name;


                    departmentSelect.appendChild(
                        option
                    );

                }
            );


        }
        catch (error) {

            console.error(
                "Department Load Error:",
                error
            );


            departmentSelect.innerHTML = `
                <option value="">
                    Department load nahi hua
                </option>
            `;

        }

    }



    // ==========================================
    // SELECT DEPARTMENT
    // ==========================================

    departmentSelect.addEventListener(
        "change",
        function () {


            const selectedId =
                this.value;


            if (!selectedId) {

                deptId = null;

                departmentIdText.textContent =
                    "-";

                return;
            }


            deptId =
                Number(selectedId);


            departmentIdText.textContent =
                deptId;


            console.log(
                "Selected Department ID:",
                deptId
            );

        }
    );



    // ==========================================
    // ADD DOCTOR
    // ==========================================

    doctorForm.addEventListener(
        "submit",
        async function (event) {


            event.preventDefault();


            // ==================================
            // CHECK HOSPITAL
            // ==================================

            if (!hospitalId) {

                alert(
                    "Hospital ID nahi mila."
                );

                return;
            }


            // ==================================
            // CHECK DEPARTMENT
            // ==================================

            if (!deptId) {

                alert(
                    "Please select department."
                );

                return;
            }



            // ==================================
            // FORM VALUES
            // ==================================

            const name =
                document.getElementById(
                    "name"
                ).value.trim();


            const email =
                document.getElementById(
                    "email"
                ).value.trim();


            const phoneNo =
                document.getElementById(
                    "phoneNo"
                ).value.trim();


            const registrationNumber =
                document.getElementById(
                    "registrationNumber"
                ).value.trim();


            const specilization =
                document.getElementById(
                    "specilization"
                ).value.trim();


            const qualification =
                document.getElementById(
                    "qualification"
                ).value.trim();


            const experience =
                document.getElementById(
                    "experience"
                ).value;


            const consultingFee =
                document.getElementById(
                    "consultingFee"
                ).value;


            const stutas =
                document.getElementById(
                    "stutas"
                ).value;



            // ==================================
            // VALIDATION
            // ==================================

            if (
                !name ||
                !email ||
                !phoneNo ||
                !registrationNumber ||
                !specilization ||
                !qualification ||
                !experience ||
                !consultingFee ||
                !stutas
            ) {

                alert(
                    "Please fill all required fields."
                );

                return;
            }



            // ==================================
            // DOCTOR JSON
            // EXACT ENTITY FIELD NAMES
            // ==================================

            const doctorData = {

                name: name,

                email: email,

                phoneNo: phoneNo,

                specilization:
                    specilization,

                qualification:
                    qualification,

                experience:
                    Number(experience),

                consultingFee:
                    Number(consultingFee),

                stutas:
                    stutas,

                hospitalId:
                    hospitalId,

                deptId:
                    deptId

            };


            console.log(
                "Doctor JSON:",
                doctorData
            );



            // ==================================
            // POST DOCTOR
            // ==================================

            try {


                const response =
                    await fetch(
                        `${DOCTOR_API}/add`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    doctorData
                                )

                        }
                    );


                console.log(
                    "Doctor Status:",
                    response.status
                );


                const responseText =
                    await response.text();


                console.log(
                    "Doctor Response:",
                    responseText
                );


                if (!response.ok) {

                    alert(
                        "Doctor add nahi hua!\n\n" +
                        "Status: " +
                        response.status +
                        "\n\n" +
                        responseText
                    );

                    return;
                }


                alert(
                    "Doctor added successfully!"
                );


                // Clear form

                doctorForm.reset();


                deptId = null;


                departmentIdText.textContent =
                    "-";


                // Reload doctor list

                loadDoctors();

            }
            catch (error) {

                console.error(
                    "Doctor Add Error:",
                    error
                );


                alert(
                    "Doctor API call failed!\n\n" +
                    error.message
                );

            }

        }
    );



    // ==========================================
    // LOAD DOCTORS
    // ONLY CURRENT HOSPITAL
    // ==========================================

    async function loadDoctors() {


        if (!hospitalId) {
            return;
        }


        try {


            const url =
                `${DOCTOR_API}/hospital/${hospitalId}`;


            console.log(
                "Doctor API:",
                url
            );


            const response =
                await fetch(url);


            console.log(
                "Doctor Status:",
                response.status
            );


            if (!response.ok) {

                const errorText =
                    await response.text();


                throw new Error(
                    "Doctor API Error: " +
                    response.status +
                    " " +
                    errorText
                );

            }


            const doctors =
                await response.json();


            console.log(
                "Doctors:",
                doctors
            );


            doctorTable.innerHTML =
                "";


            if (
                !doctors ||
                doctors.length === 0
            ) {

                doctorTable.innerHTML = `
                    <tr>

                        <td colspan="10"
                            class="empty">

                            No doctors found.

                        </td>

                    </tr>
                `;

                return;
            }



            // ==================================
            // SHOW DOCTORS
            // EXACT ENTITY FIELD NAMES
            // ==================================

            doctors.forEach(
                function (doctor) {


                    doctorTable.innerHTML += `

                        <tr>

                            <td>
                                ${doctor.doctorId ?? "-"}
                            </td>


                            <td>
                                ${doctor.name ?? "-"}
                            </td>


                            <td>
                                ${doctor.email ?? "-"}
                            </td>


                            <td>
                                ${doctor.phoneNo ?? "-"}
                            </td>


                            <td>
                                ${doctor.deptId ?? "-"}
                            </td>


                            <td>
                                ${doctor.specilization ?? "-"}
                            </td>


                            <td>
                                ${doctor.qualification ?? "-"}
                            </td>


                            <td>
                                ${doctor.experience ?? "-"}
                            </td>


                            <td>
                                ₹${doctor.consultingFee ?? "0"}
                            </td>


                            <td>
                                ${doctor.stutas ?? "-"}
                            </td>

                        </tr>

                    `;

                }
            );


        }
        catch (error) {

            console.error(
                "Doctor Load Error:",
                error
            );


            doctorTable.innerHTML = `
                <tr>

                    <td colspan="10"
                        class="empty">

                        Doctor load nahi hua.

                    </td>

                </tr>
            `;

        }

    }



    // ==========================================
    // RESET
    // ==========================================

    resetBtn.addEventListener(
        "click",
        function () {


            doctorForm.reset();


            deptId = null;


            departmentIdText.textContent =
                "-";

        }
    );



    // ==========================================
    // REFRESH
    // ==========================================

    refreshBtn.addEventListener(
        "click",
        function () {

            loadDepartments();

            loadDoctors();

        }
    );



    // ==========================================
    // LOGOUT
    // ==========================================

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



    // ==========================================
    // INITIAL LOAD
    // ==========================================

    hospitalId =
        getLoggedInHospital();


    if (!hospitalId) {
        return;
    }


    // Show current hospital ID

    hospitalIdText.textContent =
        hospitalId;


    console.log(
        "Logged-in Hospital:",
        hospitalId
    );


    // Load only this hospital's departments

    loadDepartments();


    // Load only this hospital's doctors

    loadDoctors();

});