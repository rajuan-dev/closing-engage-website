import { Link } from "react-router-dom";
import { Button, Input, Surface } from "@/components/common";

export function CompanyTeamNewPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Surface className="w-full max-w-[760px] p-8">
        <div className="text-3xl font-extrabold tracking-[-0.04em] text-ink-900">Add New Member</div>
        <div className="mt-2 text-sm text-ink-500">Invite a team member to your company account</div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Input label="Full Name" placeholder="John Doe" className="bg-white" />
          <Input label="Phone Number (optional)" placeholder="+1 (555) 000-0000" className="bg-white" />
          <Input label="Email Address" placeholder="john.doe@company.com" className="bg-white md:col-span-2" />
        </div>
        <div className="mt-8">
          <div className="text-sm font-semibold text-ink-900">Role Selection</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
              <div className="font-extrabold text-ink-900">Admin</div>
              <div className="mt-2 text-sm text-ink-500">Full access to all company settings and orders</div>
            </div>
            <div className="rounded-2xl border border-ink-100 p-5">
              <div className="font-extrabold text-ink-900">Member</div>
              <div className="mt-2 text-sm text-ink-500">Limited access to assigned orders and documents</div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <div className="text-sm font-semibold text-ink-900">Permissions</div>
          <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
            <label className="flex items-center gap-2"><input defaultChecked type="checkbox" />Create Orders</label>
            <label className="flex items-center gap-2"><input defaultChecked type="checkbox" />View Orders</label>
            <label className="flex items-center gap-2"><input type="checkbox" />Download Documents</label>
          </div>
        </div>
        <label className="mt-6 flex items-center gap-2 text-sm font-semibold text-ink-700"><input defaultChecked type="checkbox" />Send invitation email to this user</label>
        <div className="mt-8 flex justify-end gap-3">
          <Link to="/company/team"><Button variant="ghost">Cancel</Button></Link>
          <Button>Add Member</Button>
        </div>
      </Surface>
    </div>
  );
}
