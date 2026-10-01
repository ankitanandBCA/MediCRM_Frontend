const ROOM_API = "http://localhost:7004/api/room";
const BED_API = "http://localhost:7004/api/bed";

document.addEventListener("DOMContentLoaded", () => {

    const roomForm = document.getElementById("roomForm");
    const roomNumber = document.getElementById("roomNumber");
    const roomType = document.getElementById("roomType");
    const roomTable = document.getElementById("roomTable");

    const hospitalIdDisplay =
        document.getElementById("hospitalIdDisplay");

    const refreshRoomsBtn =
        document.getElementById("refreshRoomsBtn");

    const bedForm = document.getElementById("bedForm");
    const bedNumber = document.getElementById("bedNumber");
    const bedStatus = document.getElementById("bedStatus");
    const bedTable = document.getElementById("bedTable");
    const addBedBtn = document.getElementById("addBedBtn");

    const selectedRoomText =
        document.getElementById("selectedRoomText");

    const totalBeds =
        document.getElementById("totalBeds");

    const availableBeds =
        document.getElementById("availableBeds");

    const occupiedBeds =
        document.getElementById("occupiedBeds");


    let hospitalId = null;
    let currentRoomId = null;


    // ==========================================
    // GET HOSPITAL ID
    // ==========================================

    function getHospitalId() {

        const storedId = localStorage.getItem("hospitalId");

        console.log("Hospital ID:", storedId);

        if (!storedId) {

            hospitalIdDisplay.textContent = "Not Found";

            return null;
        }

        const id = Number(storedId);

        if (isNaN(id)) {

            hospitalIdDisplay.textContent = "Invalid";

            return null;
        }

        hospitalIdDisplay.textContent = id;

        return id;
    }


    // ==========================================
    // LOAD ROOMS
    // ==========================================

    async function loadRooms() {

        roomTable.innerHTML = `
            <tr>
                <td colspan="5" class="loading">
                    Loading rooms...
                </td>
            </tr>
        `;

        try {

            if (!hospitalId) {

                throw new Error(
                    "Hospital ID not found in localStorage"
                );
            }


            console.log(
                "Loading rooms for Hospital:",
                hospitalId
            );


            // First try hospital-wise API
            let response = await fetch(
                `${ROOM_API}/hospital/${hospitalId}`
            );


            console.log(
                "Hospital API status:",
                response.status
            );


            if (!response.ok) {

                console.log(
                    "Hospital-wise API failed. Trying all rooms..."
                );

                response = await fetch(
                    `${ROOM_API}/all`
                );
            }


            if (!response.ok) {

                throw new Error(
                    `HTTP Error: ${response.status}`
                );
            }


            const data = await response.json();


            console.log("Room API Response:", data);


            if (!Array.isArray(data)) {

                throw new Error(
                    "Room API did not return an array"
                );
            }


            // Hospital-wise filtering
            const rooms = data.filter(room => {

                return Number(room.hospitalId) ===
                    Number(hospitalId);

            });


            console.log(
                "Rooms for Hospital " + hospitalId + ":",
                rooms
            );


            roomTable.innerHTML = "";


            if (rooms.length === 0) {

                roomTable.innerHTML = `
                    <tr>
                        <td colspan="5" class="empty">
                            No rooms found for Hospital ID ${hospitalId}
                        </td>
                    </tr>
                `;

                return;
            }


            // ==================================
            // DISPLAY ROOMS
            // ==================================

            rooms.forEach(room => {

                const row = document.createElement("tr");


                row.innerHTML = `
                    
                    <td>
                        ${room.roomId}
                    </td>

                    <td>
                        ${room.roomNumber}
                    </td>

                    <td>
                        ${room.roomType}
                    </td>

                    <td>
                        ${room.hospitalId}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="btn-secondary"
                            onclick="selectRoom(${room.roomId})">

                            View Beds

                        </button>


                        <button
                            type="button"
                            class="btn-danger"
                            onclick="deleteRoom(${room.roomId})">

                            Delete

                        </button>

                    </td>

                `;


                roomTable.appendChild(row);

            });


        } catch (error) {

            console.error(
                "ROOM LOAD ERROR:",
                error
            );


            roomTable.innerHTML = `
                <tr>
                    <td colspan="5" class="empty">

                        Unable to load rooms

                        <br><br>

                        ${error.message}

                    </td>
                </tr>
            `;
        }
    }


    // ==========================================
    // CREATE ROOM
    // ==========================================

    roomForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!hospitalId) {

                alert(
                    "Hospital ID not found"
                );

                return;
            }


            const roomData = {

                roomNumber:
                    roomNumber.value.trim(),

                roomType:
                    roomType.value,

                hospitalId:
                    hospitalId

            };


            console.log(
                "Sending Room:",
                roomData
            );


            try {

                const response = await fetch(
                    `${ROOM_API}/add`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(roomData)

                    }
                );


                const responseText =
                    await response.text();


                console.log(
                    "Create Room Response:",
                    responseText
                );


                if (!response.ok) {

                    throw new Error(
                        responseText
                    );
                }


                alert(
                    "Room created successfully"
                );


                roomNumber.value = "";

                roomType.value = "";


                // Reload room list
                await loadRooms();

            }
            catch (error) {

                console.error(
                    "CREATE ROOM ERROR:",
                    error
                );

                alert(
                    "Failed to create room"
                );
            }

        }
    );


    // ==========================================
    // SELECT ROOM
    // ==========================================

    window.selectRoom = async function (roomId) {

        currentRoomId = roomId;


        selectedRoomText.textContent =
            "Room ID: " + roomId;


        addBedBtn.disabled = false;


        await loadBeds(roomId);
    };


    // ==========================================
    // LOAD BEDS
    // ==========================================

    async function loadBeds(roomId) {

        bedTable.innerHTML = `
            <tr>
                <td colspan="5" class="loading">
                    Loading beds...
                </td>
            </tr>
        `;


        try {

            const response =
                await fetch(
                    `${BED_API}/room/${roomId}`
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP Error: ${response.status}`
                );
            }


            const beds =
                await response.json();


            console.log(
                "Beds:",
                beds
            );


            bedTable.innerHTML = "";


            totalBeds.textContent =
                beds.length;


            const available =
                beds.filter(
                    bed =>
                        bed.status === "AVAILABLE"
                ).length;


            const occupied =
                beds.filter(
                    bed =>
                        bed.status === "OCCUPIED"
                ).length;


            availableBeds.textContent =
                available;


            occupiedBeds.textContent =
                occupied;


            if (beds.length === 0) {

                bedTable.innerHTML = `
                    <tr>
                        <td colspan="5" class="empty">
                            No beds found
                        </td>
                    </tr>
                `;

                return;
            }


            beds.forEach(bed => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${bed.bedId}
                    </td>

                    <td>
                        ${bed.bedNumber}
                    </td>

                    <td>
                        ${bed.status}
                    </td>

                    <td>
                        ${roomId}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="btn-danger"
                            onclick="deleteBed(${bed.bedId})">

                            Delete

                        </button>

                    </td>

                `;


                bedTable.appendChild(row);

            });

        }
        catch (error) {

            console.error(
                "LOAD BED ERROR:",
                error
            );


            bedTable.innerHTML = `
                <tr>
                    <td colspan="5" class="empty">
                        Unable to load beds
                    </td>
                </tr>
            `;

            totalBeds.textContent = "0";
            availableBeds.textContent = "0";
            occupiedBeds.textContent = "0";
        }
    }


    // ==========================================
    // ADD BED
    // ==========================================

    bedForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!currentRoomId) {

                alert(
                    "Please select a room first"
                );

                return;
            }


            const bedData = {

                bedNumber:
                    bedNumber.value.trim(),

                status:
                    bedStatus.value

            };


            try {

                const response =
                    await fetch(
                        `${BED_API}/room/${currentRoomId}`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(bedData)

                        }
                    );


                if (!response.ok) {

                    const error =
                        await response.text();

                    throw new Error(error);
                }


                alert(
                    "Bed added successfully"
                );


                bedNumber.value = "";


                await loadBeds(
                    currentRoomId
                );

            }
            catch (error) {

                console.error(
                    "ADD BED ERROR:",
                    error
                );

                alert(
                    "Failed to add bed"
                );
            }

        }
    );


    // ==========================================
    // DELETE ROOM
    // ==========================================

    window.deleteRoom = async function (roomId) {

        if (!confirm(
            "Are you sure you want to delete this room?"
        )) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${ROOM_API}/${roomId}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP Error: ${response.status}`
                );
            }


            alert(
                "Room deleted successfully"
            );


            currentRoomId = null;


            selectedRoomText.textContent =
                "No room selected";


            addBedBtn.disabled = true;


            bedTable.innerHTML = `
                <tr>
                    <td colspan="5" class="empty">
                        Select a room to view beds
                    </td>
                </tr>
            `;


            totalBeds.textContent = "0";
            availableBeds.textContent = "0";
            occupiedBeds.textContent = "0";


            await loadRooms();

        }
        catch (error) {

            console.error(
                "DELETE ROOM ERROR:",
                error
            );

            alert(
                "Failed to delete room"
            );
        }
    };


    // ==========================================
    // DELETE BED
    // ==========================================

    window.deleteBed = async function (bedId) {

        if (!confirm(
            "Are you sure you want to delete this bed?"
        )) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${BED_API}/${bedId}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP Error: ${response.status}`
                );
            }


            alert(
                "Bed deleted successfully"
            );


            if (currentRoomId) {

                await loadBeds(
                    currentRoomId
                );
            }

        }
        catch (error) {

            console.error(
                "DELETE BED ERROR:",
                error
            );

            alert(
                "Failed to delete bed"
            );
        }
    };


    // ==========================================
    // REFRESH
    // ==========================================

    refreshRoomsBtn.addEventListener(
        "click",
        async function () {

            await loadRooms();


            if (currentRoomId) {

                await loadBeds(
                    currentRoomId
                );
            }

        }
    );


    // ==========================================
    // START
    // ==========================================

    hospitalId =
        getHospitalId();


    console.log(
        "Final Hospital ID:",
        hospitalId
    );


    if (hospitalId) {

        loadRooms();

    }
    else {

        roomTable.innerHTML = `
            <tr>
                <td colspan="5" class="empty">
                    Hospital ID not found
                </td>
            </tr>
        `;
    }

});