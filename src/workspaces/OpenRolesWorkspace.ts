import { RoleListing } from "../domain/RoleListing";

export class OpenRolesWorkspace {
    private roles: RoleListing[] = [];
    private selectedRoleId: string | null = null;

    public addRole(role: RoleListing): void {
        this.roles.push(role);
        if (!this.selectedRoleId) this.selectedRoleId = role.id;
    }

    public selectRole(roleId: string): void {
        this.selectedRoleId = roleId;
    }

    public getRolesList(): RoleListing[] {
        return this.roles;
    }

    public getSelectedRole(): RoleListing | null {
        return this.roles.find(r => r.id === this.selectedRoleId) || null;
    }
}
