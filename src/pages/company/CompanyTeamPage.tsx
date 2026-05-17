import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Pencil, Search, Trash2, UserPlus } from "lucide-react";
import { Badge, Button, Input, Modal, Surface } from "@/components/common";
import { useStore } from "@/store/useStore";
import { useConfirmStore } from "@/store/useConfirmStore";
import { toast } from "@/store/useToastStore";
import type { TeamMember } from "@/types/models";

export function CompanyTeamPage() {
  const { teamMembers, addTeamMember, updateTeamMember, removeTeamMember } = useStore();
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedMemberRole, setSelectedMemberRole] = useState<"Admin" | "Member">("Admin");
  const [teamSearch, setTeamSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | "Admin" | "Member">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Pending Invite">("All");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const { confirm } = useConfirmStore();

  const handleDeleteMember = (email: string) => {
    confirm({
      title: "Remove Team Member?",
      message: "Are you sure you want to remove this team member? This action cannot be undone.",
      confirmLabel: "Remove Member",
      type: "danger",
      onConfirm: () => {
        removeTeamMember(email);
        toast.success("Member successfully removed.");
      },
    });
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setEmail(member.email);
    setPhone(member.phone || "");
    setSelectedMemberRole(member.role);
    setShowAddMemberModal(true);
  };

  const teamAvatars: Record<string, string> = {
    "John Doe": "from-[#23334d] to-[#1e2940]",
    "Sarah Chen": "from-[#c49a7f] to-[#f0d5c1]",
    "Marcus Bell": "from-[#1a2b39] to-[#334f67]",
  };

  const filteredTeamMembers = teamMembers.filter((member) => {
    const matchesSearch =
      teamSearch.trim() === "" ||
      member.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      member.email.toLowerCase().includes(teamSearch.toLowerCase());
    const matchesRole = roleFilter === "All" || member.role === roleFilter;
    const matchesStatus = statusFilter === "All" || member.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <>
      <div className="space-y-7">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <h1 className="text-[26px] font-bold tracking-tight text-ink-900">
              Team Management
            </h1>
            <p className="mt-1 text-[13px] text-ink-500">
              Manage your company team members and roles
            </p>
          </div>
          <Button
            className="h-[48px] rounded-[14px] px-5 text-[15px] font-semibold shadow-[0_14px_32px_rgba(24,90,188,0.18)]"
            onClick={() => {
              const isEmail = teamSearch.includes("@");
              setName("");
              setEmail(isEmail ? teamSearch : "");
              setPhone("");
              setSelectedMemberRole("Member");
              setEditingMember(null);
              setShowAddMemberModal(true);
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>

        <Surface className="rounded-[18px] border border-[#e4ebf5] bg-[#f9fbff] p-4 shadow-[0_12px_30px_rgba(20,48,112,0.04)]">
          <div className="grid gap-4 md:grid-cols-[1.4fr_0.52fr_0.52fr]">
            <div className="flex h-[48px] items-center gap-3 rounded-[12px] border border-[#dfe6f2] bg-white px-4 text-[15px] text-ink-400">
              <Search className="h-4 w-4" />
              <input
                value={teamSearch}
                onChange={(event) => setTeamSearch(event.target.value)}
                placeholder="Search by name or email"
                className="h-full w-full bg-transparent text-ink-700 outline-none placeholder:text-ink-400"
              />
            </div>
            <label className="flex h-[48px] items-center rounded-[12px] border border-[#dfe6f2] bg-white px-4">
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value as "All" | "Admin" | "Member")}
                className="h-full w-full bg-transparent text-[15px] text-ink-700 outline-none"
              >
                <option value="All">Role: All</option>
                <option value="Admin">Role: Admin</option>
                <option value="Member">Role: Member</option>
              </select>
            </label>
            <label className="flex h-[48px] items-center rounded-[12px] border border-[#dfe6f2] bg-white px-4">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as "All" | "Active" | "Pending Invite")}
                className="h-full w-full bg-transparent text-[15px] text-ink-700 outline-none"
              >
                <option value="All">Status: All</option>
                <option value="Active">Status: Active</option>
                <option value="Pending Invite">Status: Pending Invite</option>
              </select>
            </label>
          </div>
        </Surface>

        <Surface className="overflow-hidden rounded-[18px] border border-[#e4ebf5] bg-white shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-300">
                  {["Name", "Email", "Role", "Status", "Joined Date", "Actions"].map((header) => (
                    <th key={header} className="px-6 py-4">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTeamMembers.map((member) => (
                  <tr key={member.email} className="border-t border-[#edf1f7]">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${teamAvatars[member.name] ?? "from-[#21324b] to-[#6c5364]"} text-[12px] font-bold text-white`}>
                          {member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-[16px] font-semibold text-ink-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[15px] text-ink-500">{member.email}</td>
                    <td className="px-6 py-5">
                      <div className="relative inline-flex items-center">
                        <select
                          value={member.role}
                          onChange={(e) => {
                            const newRole = e.target.value as "Admin" | "Member";
                            updateTeamMember(member.email, { role: newRole });
                            toast.success(`${member.name}'s role updated to ${newRole}`);
                          }}
                          className="appearance-none rounded-full bg-[#f1f4f9] pl-4 pr-8 py-1.5 text-[13px] font-bold text-ink-600 outline-none cursor-pointer hover:bg-brand-50 hover:text-brand-700 transition-all border border-transparent focus:border-brand-200"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Member">Member</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-ink-400" />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge status={member.status} />
                    </td>
                    <td className="px-6 py-5 text-[15px] text-ink-500">{member.joinedDate}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-5 text-ink-500">
                        <button 
                          type="button" 
                          aria-label={`Edit ${member.name}`}
                          onClick={() => handleEditMember(member)}
                          className="hover:text-brand-600 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button 
                          type="button" 
                          aria-label={`Delete ${member.name}`}
                          onClick={() => handleDeleteMember(member.email)}
                          className="hover:text-danger-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-[#edf1f7] px-6 py-5 text-sm text-ink-500">
            <span>Showing {filteredTeamMembers.length} of {teamMembers.length} team members</span>
            <div className="flex items-center gap-4">
              <button className="text-ink-400">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-semibold text-ink-900">1</span>
              <button className="text-ink-500">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Surface>
      </div>

      <Modal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        title={editingMember ? "Edit Team Member" : "Add New Member"}
        subtitle={editingMember ? "Update the details for this team member" : "Invite a team member to your company account"}
      >
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (!name || !email) {
              toast.error("Full name and email are required.");
              return;
            }

            if (editingMember) {
              updateTeamMember(editingMember.email, {
                name,
                email,
                phone,
                role: selectedMemberRole,
              });
              toast.success(`${name} has been updated!`);
            } else {
              addTeamMember({
                name: name,
                email: email,
                phone: phone,
                role: selectedMemberRole,
                status: "Pending Invite",
                joinedDate: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }),
              });
              toast.success(`${name} has been invited!`);
            }
            setShowAddMemberModal(false);
          }}
        >
          <div className="space-y-7 px-7 pb-7">
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="FULL NAME"
                id="team-member-name"
                name="name"
                autoComplete="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-[50px] rounded-[12px] border-[#e2e8f3] bg-[#f7f9fd] px-4 text-[15px]"
              />
              <Input
                label="EMAIL ADDRESS"
                id="team-member-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="john.doe@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[50px] rounded-[12px] border-[#e2e8f3] bg-[#f7f9fd] px-4 text-[15px]"
              />
              <Input
                label="PHONE NUMBER (OPTIONAL)"
                id="team-member-phone"
                name="tel"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-[50px] rounded-[12px] border-[#e2e8f3] bg-[#f7f9fd] px-4 text-[15px] md:col-span-2"
              />
            </div>

            <div>
              <div className="mb-4 text-[13px] font-bold uppercase tracking-[0.08em] text-ink-400">
                Select Member Role
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  className={`flex flex-col rounded-[20px] border p-6 text-left transition-all ${
                    selectedMemberRole === "Admin" 
                      ? "border-brand-300 bg-[#f4f8ff] ring-1 ring-brand-300" 
                      : "border-[#e5ebf5] bg-white hover:border-brand-200"
                  }`}
                  onClick={() => setSelectedMemberRole("Admin")}
                >
                  <div className="text-[18px] font-extrabold text-ink-900">Admin</div>
                  <div className="mt-2 text-[14px] leading-[1.6] text-ink-500">
                    Full access to all orders, documents, and team settings
                  </div>
                </button>
                <button
                  type="button"
                  className={`flex flex-col rounded-[20px] border p-6 text-left transition-all ${
                    selectedMemberRole === "Member" 
                      ? "border-brand-300 bg-[#f4f8ff] ring-1 ring-brand-300" 
                      : "border-[#e5ebf5] bg-white hover:border-brand-200"
                  }`}
                  onClick={() => setSelectedMemberRole("Member")}
                >
                  <div className="text-[18px] font-extrabold text-ink-900">Member</div>
                  <div className="mt-2 text-[14px] leading-[1.6] text-ink-500">
                    Access to view and manage assigned orders only
                  </div>
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-[16px] bg-[#eef4ff] px-4 py-4 text-[16px] font-semibold text-brand-600">
              <input defaultChecked type="checkbox" className="h-4 w-4" />
              Send invitation email to this user
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[#edf1f7] bg-[#fbfcff] px-7 py-5">
            <Button
              variant="outline"
              className="h-[46px] rounded-[12px] border-[#dfe6f2] px-6 text-[15px] font-semibold text-ink-700"
              onClick={() => setShowAddMemberModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-[46px] rounded-[12px] px-6 text-[15px] font-semibold"
            >
              {editingMember ? "Save Changes" : "Add Member"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
