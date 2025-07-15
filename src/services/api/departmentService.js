import departmentsData from "@/services/mockData/departments.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const departmentService = {
  async getAll() {
    await delay(300);
    return [...departmentsData];
  },

  async getById(id) {
    await delay(200);
    const department = departmentsData.find(d => d.Id === id);
    if (!department) {
      throw new Error("Department not found");
    }
    return { ...department };
  },

  async create(departmentData) {
    await delay(400);
    const maxId = Math.max(...departmentsData.map(d => d.Id), 0);
    const newDepartment = {
      Id: maxId + 1,
      ...departmentData
    };
    departmentsData.push(newDepartment);
    return { ...newDepartment };
  },

  async update(id, departmentData) {
    await delay(300);
    const index = departmentsData.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Department not found");
    }
    
    const updatedDepartment = {
      ...departmentsData[index],
      ...departmentData,
      Id: id
    };
    
    departmentsData[index] = updatedDepartment;
    return { ...updatedDepartment };
  },

  async delete(id) {
    await delay(250);
    const index = departmentsData.findIndex(d => d.Id === id);
    if (index === -1) {
      throw new Error("Department not found");
    }
    
    const deletedDepartment = departmentsData.splice(index, 1)[0];
    return { ...deletedDepartment };
  }
};