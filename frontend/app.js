const BACKEND_URL = 'http://localhost:3500/employees'

// Get employees
const getEmployees = async () => {
    const res = await fetch(BACKEND_URL, {
        method: "GET"
    });

    if (!res.ok) {
        throw new Error(`Failed to get employees: ${response.statusText}`)
    }

    const data = await res.json()
    return data
}

// Get employees by id
const getEmployeesById = async (id) => {
    const res = await fetch(`${BACKEND_URL}/${id}`, {
        method: "GET"
    });

    if (!res.ok) {
        throw new Error(`Failed to get employees: ${response.statusText}`)
    }

    const data = await res.json()
    return data
}

// Add employee
const addEmployee = async (firstname, lastname, age, isMarried) => {
    const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            firstname,
            lastname,
            age,
            isMarried
        })
    })

    if (!res.ok) {
        throw new Error(`Failed to add employee: ${response.statusText}`)
    }

    const data = await res.json()
    return data
}

// Update employee
const updateEmployee = async (id, updateData) => {
    const res = await fetch(`${BACKEND_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData)
    })

    if (!res.ok) {
        throw new Error(`Failed to update employee: ${response.statusText}`)
    }

    const data = await res.json()
    return data
}

// Delete employee
const deleteEmployee = async (id) => {
    const res = await fetch(`${BACKEND_URL}/${id}`, {
        method: "DELETE"
    })

    if (!res.ok) {
        throw new Error(`Failed to delete employee: ${response.statusText}`)
    }
}

// Search employee
const searchEmployee = async (keyword) => {
    const res = await fetch(`${BACKEND_URL}/search?firstname=${keyword}`, {
        method: "GET"
    })

    if (!res.ok) {
        throw new Error(`Failed to find employee: ${response.statusText}`)
    }

    const data = await res.json()
    return data
}

// Handle event
const employeeList = document.querySelector('.employee-list')
const searchForm = document.querySelector('.search')
const addForm = document.querySelector('.add')
const updateForm = document.querySelector('.edit')

// Load employees on page load
window.addEventListener('DOMContentLoaded', async () => {
    await build()
})

// Build list
async function build() {
    const employees = await getEmployees()
    employeeList.innerHTML = ''
    employees.forEach(emp => {
        const li = document.createElement('li')
        li.innerHTML = `
            ${emp.firstname} ${emp.lastname}
            <button class="list-view">VIEW</button>
            <button class="list-edit">EDIT</button>
            <button class="list-delete">DELETE</button>
        `

        const viewBtn = li.querySelector('.list-view')
        const editBtn = li.querySelector('.list-edit')
        const deleteBtn = li.querySelector('.list-delete')

        viewBtn.addEventListener('click', () => viewEmployee(emp.id))
        editBtn.addEventListener('click', () => editing(emp.id))
        deleteBtn.addEventListener('click', () => removeEmployee(emp.id))

        employeeList.appendChild(li)
    })
}

// Add employee event
addForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const firstname = document.getElementById('add-firstname-input').value
    const lastname = document.getElementById('add-lastname-input').value
    const age = parseInt(document.getElementById('add-age-input').value)
    const isMarried = document.getElementById('add-isMarried').checked

    await addEmployee(firstname, lastname, age, isMarried)
    addForm.reset()
    await build()
})

const editFirstname = document.getElementById("edit-firstname-input")
const editLastname = document.getElementById("edit-lastname-input")
const editAge = document.getElementById("edit-age-input")
const editIsMarried = document.getElementById("edit-isMarried")
const editId = document.getElementById("edit-id")

// Update function
async function editing(id) {
    const employee = await getEmployeesById(id)

    let currentId = null

    editFirstname.value = employee.firstname
    editLastname.value = employee.lastname
    editAge.value = employee.age
    editIsMarried.checked = employee.isMarried
    editId.value = employee.id

    currentId = id
}

// Update employee form
updateForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const currentEditId = editId.value

    if (!currentEditId) {
        alert('No employee selected!')
        return
    }

    const updateData = {
        firstname: editFirstname.value,
        lastname: editLastname.value,
        age: parseInt(editAge.value),
        isMarried: editIsMarried.checked
    }

    await updateEmployee(currentEditId, updateData)
    currentId = null
    updateForm.reset()
    await build()
})

// Delete function
async function removeEmployee(id) {
    const confirmation = confirm('Are you sure you want to delete this employee?')
    if (confirmation) {
        await deleteEmployee(id)
        await build()
    }
}

function buildViewItem(employee) {
    const li = document.createElement('li')
    li.innerHTML = `
        <p>First name: ${employee.firstname}</p>
        <p>Last name: ${employee.lastname}</p>
        <p>Age: ${employee.age}</p>
        <p>Married: ${employee.isMarried ? "Yes" : "No"}</p>
    `
    viewEmployeeInfo.appendChild(li)
}

// View employee
const viewEmployeeInfo = document.querySelector('.employee-info')

async function viewEmployee(id) {
    const employee = await getEmployeesById(id)
    viewEmployeeInfo.innerHTML = ''
    buildViewItem(employee)
}

// Search function
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const query = document.getElementById('search-input').value.trim()
    if (!query) return alert("Please enter a name to search!")

    const data = await searchEmployee(query)
    viewEmployeeInfo.innerHTML = ''
    data.forEach(emp => {
        buildViewItem(emp)
    })
})
