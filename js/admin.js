document.addEventListener("DOMContentLoaded", () => {
    fetchCourses();
    fetchContacts();
});

async function fetchCourses() {
    let response = await fetch("http://127.0.0.1:8000/courses");
    let data = await response.json();

    let coursesList = document.getElementById("coursesList");
    coursesList.innerHTML = "";

    data.data.forEach(category => {
        let categoryTitle = document.createElement("li");
        categoryTitle.innerHTML = `<strong>📌 ${category.title}</strong>`;
        coursesList.appendChild(categoryTitle);

        category.courses.forEach(course => {
            let courseItem = document.createElement("li");
            courseItem.innerHTML = `
                📖 ${course.name} — ${course.price}$
                <button onclick="deleteCourse('${category.category}', '${course.name}')">
                    🗑
                </button>
            `;
            coursesList.appendChild(courseItem);
        });
    });
}

async function addCourse() {
    let category = document.getElementById("categorySelect").value;
    let name = document.getElementById("courseName").value;
    let desc = document.getElementById("courseDesc").value;
    let continues = document.getElementById("courseContinues").value;
    let price = document.getElementById("coursePrice").value;

    let course = { name, desc, continues: parseInt(continues), price: parseInt(price) };

    let response = await fetch(`http://127.0.0.1:8000/add-course/?category_name=${category}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
    });

    let result = await response.json();
    fetchCourses();
}

async function deleteCourse(category, courseName) {
    await fetch(`http://127.0.0.1:8000/delete-course/${category}/${courseName}`, { method: "DELETE" });
    fetchCourses();
}

async function fetchContacts() {
    let response = await fetch("http://127.0.0.1:8000/contacts");
    let data = await response.json();

    document.getElementById("email").value = data.contact_info.email;
    document.getElementById("phone").value = data.contact_info.phone;
    document.getElementById("address").value = data.contact_info.address;
}

document.getElementById("contact-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const updatedData = {
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value
    };

    await fetch("http://127.0.0.1:8000/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    });

    document.getElementById("status-message").textContent = "Контакты успешно обновлены!";
});

document.addEventListener("DOMContentLoaded", function () {
    let phoneNumber = document.querySelector(".phoneNumber");
    let email = document.querySelector(".email");
    let address = document.querySelector(".address");
  
    fetch("http://127.0.0.1:8000/contacts")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Данные с сервера:", data);
        phoneNumber.textContent = data.contact_info.phone;
        email.textContent = data.contact_info.email;
        address.textContent = data.contact_info.address;
      })
      .catch((error) => {
        console.error("Ошибка:", error);
        phoneNumber.textContent = "Ошибка!";
        email.textContent = "Ошибка!";
        address.textContent = "Ошибка!";
      });
});
