import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { memberService } from "@/services/api/memberService";

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    status: "active"
  });

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await memberService.getAll();
      setMembers(data);
    } catch (err) {
      setError(err.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingMember) {
        const updatedMember = await memberService.update(editingMember.Id, formData);
        setMembers(prev => prev.map(m => m.Id === editingMember.Id ? updatedMember : m));
        toast.success("Member updated successfully");
      } else {
        const newMember = await memberService.create({
          ...formData,
          joinDate: new Date().toISOString()
        });
        setMembers(prev => [...prev, newMember]);
        toast.success("Member added successfully");
      }
      
      resetForm();
    } catch (err) {
      toast.error("Failed to save member");
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      department: member.department,
      status: member.status
    });
    setShowAddForm(true);
  };

  const handleDelete = async (memberId) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    
    try {
      await memberService.delete(memberId);
      setMembers(prev => prev.filter(m => m.Id !== memberId));
      toast.success("Member deleted successfully");
    } catch (err) {
      toast.error("Failed to delete member");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      department: "",
      status: "active"
    });
    setEditingMember(null);
    setShowAddForm(false);
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading variant="table" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load members"
        message={error}
        onRetry={loadMembers}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">
            Members
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your team members and their information
          </p>
        </div>
        
        <Button
          onClick={() => setShowAddForm(true)}
          className="w-full sm:w-auto"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Member
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6">
        <SearchBar
          placeholder="Search members by name, email, or department..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </Card>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-display">
              {editingMember ? "Edit Member" : "Add New Member"}
            </h2>
            <Button
              variant="ghost"
              onClick={resetForm}
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter member name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <Input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Enter department"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingMember ? "Update Member" : "Add Member"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Members List */}
      <Card>
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold font-display">
            Team Members
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredMembers.length} members found
          </p>
        </div>
        
        {filteredMembers.length === 0 ? (
          <Empty
            title="No members found"
            message={searchTerm ? "No members match your search criteria." : "Add your first team member to get started."}
            actionLabel="Add Member"
            onAction={() => setShowAddForm(true)}
            icon="Users"
          />
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <div key={member.Id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary-light/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={24} className="text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {member.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {member.department} • Joined {format(new Date(member.joinDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge variant={member.status === "active" ? "success" : "error"}>
                    {member.status}
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(member)}
                  >
                    <ApperIcon name="Edit" size={16} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(member.Id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MemberList;