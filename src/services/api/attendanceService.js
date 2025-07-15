import attendanceData from "@/services/mockData/attendanceRecords.json";
import membersData from "@/services/mockData/members.json";
import { format } from "date-fns";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    await delay(300);
    return [...attendanceData];
  },

  async getById(id) {
    await delay(200);
    const record = attendanceData.find(r => r.Id === id);
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  },

  async getByDate(date) {
    await delay(350);
    // Create attendance records for all members for the given date
    const dateStr = format(new Date(date), "yyyy-MM-dd");
    
    // Check if we already have records for this date
    const existingRecords = attendanceData.filter(r => r.date === dateStr);
    
    if (existingRecords.length > 0) {
      return [...existingRecords];
    }
    
    // If no records exist, create default absent records for all members
    const defaultRecords = membersData.map(member => {
      const maxId = Math.max(...attendanceData.map(r => r.Id), 0);
      const newRecord = {
        Id: maxId + member.Id, // Simple ID generation
        memberId: member.Id,
        date: dateStr,
        checkIn: null,
        checkOut: null,
        status: "absent",
        notes: ""
      };
      
      // Add to the data array
      attendanceData.push(newRecord);
      return newRecord;
    });
    
    return defaultRecords;
  },

  async getByMember(memberId) {
    await delay(300);
    const records = attendanceData.filter(r => r.memberId === memberId);
    return [...records];
  },

  async create(recordData) {
    await delay(400);
    const maxId = Math.max(...attendanceData.map(r => r.Id), 0);
    const newRecord = {
      Id: maxId + 1,
      ...recordData,
      date: recordData.date || format(new Date(), "yyyy-MM-dd")
    };
    attendanceData.push(newRecord);
    return { ...newRecord };
  },

  async update(id, recordData) {
    await delay(300);
    const index = attendanceData.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    
    const updatedRecord = {
      ...attendanceData[index],
      ...recordData,
      Id: id
    };
    
    attendanceData[index] = updatedRecord;
    return { ...updatedRecord };
  },

  async delete(id) {
    await delay(250);
    const index = attendanceData.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    
    const deletedRecord = attendanceData.splice(index, 1)[0];
    return { ...deletedRecord };
  },

  async markAttendance(memberId, status, notes = "") {
    await delay(300);
    const today = format(new Date(), "yyyy-MM-dd");
    
    // Find existing record for today
    const existingIndex = attendanceData.findIndex(r => 
      r.memberId === memberId && r.date === today
    );
    
    if (existingIndex !== -1) {
      // Update existing record
      const updatedRecord = {
        ...attendanceData[existingIndex],
        status,
        notes,
        checkIn: status === "present" || status === "late" ? new Date().toISOString() : null,
        checkOut: status === "absent" ? null : attendanceData[existingIndex].checkOut
      };
      
      attendanceData[existingIndex] = updatedRecord;
      return { ...updatedRecord };
    } else {
      // Create new record
      const maxId = Math.max(...attendanceData.map(r => r.Id), 0);
      const newRecord = {
        Id: maxId + 1,
        memberId,
        date: today,
        checkIn: status === "present" || status === "late" ? new Date().toISOString() : null,
        checkOut: null,
        status,
        notes
      };
      
      attendanceData.push(newRecord);
      return { ...newRecord };
    }
  }
};