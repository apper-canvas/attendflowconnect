import leaveRequestsData from "@/services/mockData/leaveRequests.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const leaveRequestService = {
  async getAll() {
    await delay(300);
    return [...leaveRequestsData];
  },

  async getById(id) {
    await delay(200);
    const request = leaveRequestsData.find(r => r.Id === id);
    if (!request) {
      throw new Error("Leave request not found");
    }
    return { ...request };
  },

  async create(requestData) {
    await delay(400);
    const maxId = Math.max(...leaveRequestsData.map(r => r.Id), 0);
    const newRequest = {
      Id: maxId + 1,
      ...requestData,
      requestDate: requestData.requestDate || new Date().toISOString(),
      status: "pending"
    };
    leaveRequestsData.push(newRequest);
    return { ...newRequest };
  },

  async update(id, requestData) {
    await delay(300);
    const index = leaveRequestsData.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Leave request not found");
    }
    
    const updatedRequest = {
      ...leaveRequestsData[index],
      ...requestData,
      Id: id
    };
    
    leaveRequestsData[index] = updatedRequest;
    return { ...updatedRequest };
  },

  async delete(id) {
    await delay(250);
    const index = leaveRequestsData.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Leave request not found");
    }
    
    const deletedRequest = leaveRequestsData.splice(index, 1)[0];
    return { ...deletedRequest };
  },

  async approve(id) {
    await delay(300);
    const index = leaveRequestsData.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Leave request not found");
    }
    
    leaveRequestsData[index].status = "approved";
    leaveRequestsData[index].processedDate = new Date().toISOString();
    return { ...leaveRequestsData[index] };
  },

  async reject(id) {
    await delay(300);
    const index = leaveRequestsData.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Leave request not found");
    }
    
    leaveRequestsData[index].status = "rejected";
    leaveRequestsData[index].processedDate = new Date().toISOString();
    return { ...leaveRequestsData[index] };
  },

  async getByEmployee(employeeId) {
    await delay(200);
    const requests = leaveRequestsData.filter(r => r.employeeId === employeeId);
    return [...requests];
  },

  async getPendingRequests() {
    await delay(250);
    const pendingRequests = leaveRequestsData.filter(r => r.status === "pending");
    return [...pendingRequests];
  }
};