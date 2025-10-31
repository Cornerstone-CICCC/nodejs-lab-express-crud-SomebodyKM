import { Router, Request, Response } from 'express'
import { Employee } from '../types/employee'
import { v4 as uuidv4 } from 'uuid'

const employeeRouter = Router()

// In-memory database
const employees: Employee[] = []

/**
 * Get all employees
 * 
 * @route GET /employees
 * @param { Request } req - Express request object.
 * @param { Response } res - Express response object.
 * @returns { void } - Responds with employee list items.
 */
employeeRouter.get('/', (req: Request, res: Response) => {
    res.status(200).json(employees)
})

/**
 * Search employee by keyword
 * 
 * @route GET /employees/search?keyword=TEST
 * @param { Request } req - Express request object which contains the keyword query.
 * @param { Response } res - Express response object.
 * @returns { void } - Respond with list of search results.
 */
employeeRouter.get('/search', (
    req: Request<{}, {}, {}, { firstname: string }>,
    res: Response
) => {
    const { firstname } = req.query
    const results: Employee[] = employees.filter(
        emp => emp.firstname.toLowerCase().includes(firstname.toLowerCase())
    )
    if (results.length === 0) {
        res.status(404).send("No employees found.")
        return
    }
    res.status(200).json(results)
})

/**
 * Get employee by id
 * 
 * @route GET /employees/:id
 * @param { Request } req - Express request object containing id.
 * @param { Response } res - Express response object.
 * @returns { void } - Responds with employee by id.
 */
employeeRouter.get('/:id', (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params
    const found = employees.find(emp => emp.id === id)
    if (!found) {
        res.status(404).send("Employee not found")
        return
    }
    res.status(200).json(found)
})

/**
 * Add employee
 * 
 * @route POST /
 * @param { Request } req - Express request object containing employee object.
 * @param { Response } res - Express response object.
 * @returns { void } - Responds with created employee.
 */
employeeRouter.post("/", (req: Request<{}, {}, Omit<Employee, 'id'>>, res: Response) => {
    const { firstname, lastname, age, isMarried } = req.body
    const newEmployee: Employee = {
        id: uuidv4(),
        firstname,
        lastname,
        age,
        isMarried
    }
    employees.push(newEmployee)
    res.status(201).json(newEmployee)
})

/**
 * Update employee by id
 * 
 * @route PUT /employees/:id
 * @param { Request } - Express request object which contains id param and employee object.
 * @param { Response } - Express response object.
 * @returns { void } - Respond with updated employee object.
 */
employeeRouter.put("/:id", (
    req: Request<{ id: string }, {}, Partial<Employee>>,
    res: Response
) => {
    const { id } = req.params
    const foundIndex = employees.findIndex(emp => emp.id === id)
    if (foundIndex === -1) {
        res.status(404).send("Employee not found.")
        return
    }
    const updatedEmployee: Employee = {
        ...employees[foundIndex],
        firstname: req.body.firstname ?? employees[foundIndex].firstname,
        lastname: req.body.lastname ?? employees[foundIndex].lastname,
        age: req.body.age ?? employees[foundIndex].age,
        isMarried: req.body.isMarried ?? employees[foundIndex].isMarried
    }
    employees[foundIndex] = updatedEmployee
    res.status(201).json(updatedEmployee)
})

/**
 * Delete employee by id
 * 
 * @route DELETE /employees/:id
 * @param { Request } req - Express request object.
 * @param { Response } res - Express response object.
 * @returns { void } - Responds with deletion message.
 */
employeeRouter.delete('/:id', (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params
    const index = employees.findIndex(emp => emp.id === id)
    if (index === -1) {
        res.status(404).send("Employee not found")
        return
    }
    employees.splice(index, 1)
    res.status(200).send("Employee deleted.")
})

export default employeeRouter