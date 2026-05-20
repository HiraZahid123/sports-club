<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles
        $roles = [
            'Manager',
            'Coach',
            'Athlete',
            'Parent',
            'Super Admin',
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // Define basic permissions (stubs for now)
        $permissions = [
            'manage clubs',
            'manage members',
            'manage payments',
            'view dashboard',
            'manage training groups',
        ];

        foreach ($permissions as $permissionName) {
            Permission::firstOrCreate(['name' => $permissionName]);
        }

        // Assign all permissions to Super Admin and Manager
        $managerRole = Role::findByName('Manager');
        $managerRole->givePermissionTo(Permission::all());

        $superAdminRole = Role::findByName('Super Admin');
        $superAdminRole->givePermissionTo(Permission::all());
    }
}
