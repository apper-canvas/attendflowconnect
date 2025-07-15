import membersData from "@/services/mockData/members.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const memberService = {
  async getAll() {
    await delay(300);
    return [...membersData];
  },

  async getById(id) {
    await delay(200);
    const member = membersData.find(m => m.Id === id);
    if (!member) {
      throw new Error("Member not found");
    }
    return { ...member };
  },

  async create(memberData) {
    await delay(400);
    const maxId = Math.max(...membersData.map(m => m.Id), 0);
    const newMember = {
      Id: maxId + 1,
      ...memberData,
      joinDate: memberData.joinDate || new Date().toISOString()
    };
    membersData.push(newMember);
    return { ...newMember };
  },

  async update(id, memberData) {
    await delay(300);
    const index = membersData.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error("Member not found");
    }
    
    const updatedMember = {
      ...membersData[index],
      ...memberData,
      Id: id
    };
    
    membersData[index] = updatedMember;
    return { ...updatedMember };
  },

  async delete(id) {
    await delay(250);
    const index = membersData.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error("Member not found");
    }
    
    const deletedMember = membersData.splice(index, 1)[0];
    return { ...deletedMember };
  }
};