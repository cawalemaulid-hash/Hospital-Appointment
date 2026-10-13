// GET the appointment form from HTML
const appointmentForm = document.getElementById("appointmentForm"); 


appointmentForm.addEventListener("submit", function(event) {

    // Prevent the page from refreshing immediately
    event.preventDefault();

    // Collect data entered in the form
    const appointment = {
        fullName: document.getElementById("fullName").value,
        phone: document.getElementById("phone").value,
        department: document.getElementById("department").value,
        doctor: document.getElementById("doctor").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        reason: document.getElementById("reason").value
    };

    // Sending the new appointment to JSON Server
    fetch("http://localhost:3000/appointments", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(appointment)
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error("Failed to save appointment");
        }

        return response.json();
    })
    .then(function() {
        // Refresh the page to show the new appointment
        location.reload();
    })
    .catch(function(error) {
        console.error(error);
        alert("Could not save appointment. Check JSON Server.");
    });

});


// show appointments in frontend form
fetch("http://localhost:3000/appointments")
.then(function (response) {
    return response.json();
})
.then(function (data) {
    const appointmentsDiv = document.getElementById("appointments");
    appointmentsDiv.innerHTML = "";

    data.forEach(function (appointment) {
        const appointmentDiv = document.createElement("div");
        appointmentDiv.className = "appointment-card";
        appointmentDiv.innerHTML =
            "Name: " + appointment.fullName + "<br>" +
            "Phone: " + appointment.phone + "<br>" +
            "Department: " + appointment.department + "<br>" +
            "Doctor: " + appointment.doctor + "<br>" +
            "Date: " + appointment.date + "<br>" +
            "Time: " + appointment.time + "<br>" +
            "Reason: " + appointment.reason + "<br>";

        // edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-button";
        appointmentDiv.appendChild(editButton);

        editButton.addEventListener("click", function () {
            const fullName = prompt("Edit name:", appointment.fullName);
            if (fullName === null) return;

            const phone = prompt("Edit phone:", appointment.phone);
            if (phone === null) return;

            const department = prompt("Edit department:", appointment.department);
            if (department === null) return;

            const doctor = prompt("Edit doctor:", appointment.doctor);
            if (doctor === null) return;

            const date = prompt("Edit date (YYYY-MM-DD):", appointment.date);
            if (date === null) return;

            const time = prompt("Edit time (HH:MM):", appointment.time);
            if (time === null) return;

            const reason = prompt("Edit reason:", appointment.reason);
            if (reason === null) return;



            // Send the updated appointment data to JSON Server. method is PUT because we are updating an existing resource.
            fetch("http://localhost:3000/appointments/" + appointment.id, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: fullName,
                    phone: phone,
                    department: department,
                    doctor: doctor,
                    date: date,
                    time: time,
                    reason: reason
                })
            })
            .then(function () {
                location.reload();
            });
        });

        // delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button"; 
        appointmentDiv.appendChild(deleteButton);

        deleteButton.addEventListener("click", function () {
            if (!confirm("Are you sure you want to delete this appointment?")) return;

            fetch("http://localhost:3000/appointments/" + appointment.id, {
                method: "DELETE"
            })
            .then(function () {
                location.reload();
            });
        });
            //append the appointment card to the appointments div
        appointmentsDiv.appendChild(appointmentDiv);
    });
});