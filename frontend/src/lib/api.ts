const API_BASE_URL = 'http://localhost:8081';
const OPD_BASE_URL = 'http://localhost:8082';
const IPD_BASE_URL = 'http://localhost:8083';
const TRANSPORT_BASE_URL = 'http://localhost:8084';
const STAFF_BASE_URL = 'http://localhost:8085';
const LAB_BASE_URL = 'http://localhost:8086';

export interface ServiceStatus {
    name: string;
    url: string;
    status: 'online' | 'offline' | 'checking';
    port: number;
}

class ApiClient {
    private getAuthHeader(): HeadersInit {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader(),
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // Health check for all services
    async checkServices(): Promise<ServiceStatus[]> {
        const services = [
            { name: 'Auth Service', url: API_BASE_URL, port: 8081 },
            { name: 'OPD Service', url: OPD_BASE_URL, port: 8082 },
            { name: 'IPD Service', url: IPD_BASE_URL, port: 8083 },
            { name: 'Transport Service', url: TRANSPORT_BASE_URL, port: 8084 },
            { name: 'Staff Service', url: STAFF_BASE_URL, port: 8085 },
            { name: 'Lab Service', url: LAB_BASE_URL, port: 8086 },
        ];

        const results = await Promise.all(
            services.map(async (service) => {
                try {
                    const response = await fetch(`${service.url}/api/auth/public/status`, {
                        method: 'GET',
                        signal: AbortSignal.timeout(3000),
                    });
                    return {
                        ...service,
                        status: response.ok ? 'online' as const : 'offline' as const,
                    };
                } catch {
                    return { ...service, status: 'offline' as const };
                }
            })
        );

        return results;
    }

    // Quick check if auth service is available
    async isBackendAvailable(): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/public/status`, {
                method: 'GET',
                signal: AbortSignal.timeout(2000),
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    // Auth endpoints
    auth = {
        login: (email: string, password: string) =>
            this.request<{ token: string; email: string; name: string; role: string }>(
                `${API_BASE_URL}/api/auth/public/login`,
                { method: 'POST', body: JSON.stringify({ email, password }) }
            ),
        getProfile: () =>
            this.request(`${API_BASE_URL}/api/auth/user/profile`),
        logout: () =>
            this.request(`${API_BASE_URL}/api/auth/public/logout`, { method: 'POST' }),
        checkStatus: () =>
            this.request<{ status: string }>(`${API_BASE_URL}/api/auth/public/status`),
    };

    // OPD endpoints
    patients = {
        getAll: () => this.request<any[]>(`${OPD_BASE_URL}/api/opd/patients`),
        getById: (id: number) => this.request(`${OPD_BASE_URL}/api/opd/patients/${id}`),
        search: (query: string) => this.request<any[]>(`${OPD_BASE_URL}/api/opd/patients/search?query=${query}`),
        create: (patient: any) => this.request(`${OPD_BASE_URL}/api/opd/patients`, { method: 'POST', body: JSON.stringify(patient) }),
        update: (id: number, patient: any) => this.request(`${OPD_BASE_URL}/api/opd/patients/${id}`, { method: 'PUT', body: JSON.stringify(patient) }),
        delete: (id: number) => this.request(`${OPD_BASE_URL}/api/opd/patients/${id}`, { method: 'DELETE' }),
    };

    appointments = {
        getAll: () => this.request<any[]>(`${OPD_BASE_URL}/api/opd/appointments`),
        getById: (id: number) => this.request(`${OPD_BASE_URL}/api/opd/appointments/${id}`),
        getToday: (department: string) => this.request<any[]>(`${OPD_BASE_URL}/api/opd/appointments/today/${department}`),
        create: (appointment: any) => this.request(`${OPD_BASE_URL}/api/opd/appointments`, { method: 'POST', body: JSON.stringify(appointment) }),
        checkIn: (id: number) => this.request(`${OPD_BASE_URL}/api/opd/appointments/${id}/check-in`, { method: 'POST' }),
        cancel: (id: number) => this.request(`${OPD_BASE_URL}/api/opd/appointments/${id}/cancel`, { method: 'POST' }),
        complete: (id: number) => this.request(`${OPD_BASE_URL}/api/opd/appointments/${id}/complete`, { method: 'POST' }),
    };

    queue = {
        getByDepartment: (department: string) => this.request<any[]>(`${OPD_BASE_URL}/api/opd/queue/department/${department}`),
        getByDoctor: (doctorId: string) => this.request<any[]>(`${OPD_BASE_URL}/api/opd/queue/doctor/${doctorId}`),
        callNext: (doctorId: string) => this.request(`${OPD_BASE_URL}/api/opd/queue/doctor/${doctorId}/call-next`, { method: 'POST' }),
    };

    // IPD endpoints
    beds = {
        getAll: () => this.request<any[]>(`${IPD_BASE_URL}/api/ipd/beds`),
        getById: (id: number) => this.request(`${IPD_BASE_URL}/api/ipd/beds/${id}`),
        getByWard: (ward: string) => this.request<any[]>(`${IPD_BASE_URL}/api/ipd/beds/ward/${ward}`),
        getAvailable: (type: string) => this.request<any[]>(`${IPD_BASE_URL}/api/ipd/beds/available/${type}`),
        getStatistics: () => this.request(`${IPD_BASE_URL}/api/ipd/beds/statistics`),
        create: (bed: any) => this.request(`${IPD_BASE_URL}/api/ipd/beds`, { method: 'POST', body: JSON.stringify(bed) }),
        updateStatus: (id: number, status: string) => this.request(`${IPD_BASE_URL}/api/ipd/beds/${id}/status?status=${status}`, { method: 'PATCH' }),
    };

    admissions = {
        getAll: () => this.request<any[]>(`${IPD_BASE_URL}/api/ipd/admissions`),
        getActive: () => this.request<any[]>(`${IPD_BASE_URL}/api/ipd/admissions/active`),
        getById: (id: number) => this.request(`${IPD_BASE_URL}/api/ipd/admissions/${id}`),
        admit: (admission: any) => this.request(`${IPD_BASE_URL}/api/ipd/admissions`, { method: 'POST', body: JSON.stringify(admission) }),
        discharge: (id: number, notes: string, type: string) => this.request(`${IPD_BASE_URL}/api/ipd/admissions/${id}/discharge?dischargeNotes=${notes}&dischargeType=${type}`, { method: 'POST' }),
        transfer: (id: number, newBedId: number) => this.request(`${IPD_BASE_URL}/api/ipd/admissions/${id}/transfer?newBedId=${newBedId}`, { method: 'POST' }),
    };

    // Transport endpoints
    transport = {
        getAll: () => this.request<any[]>(`${TRANSPORT_BASE_URL}/api/transport/requests`),
        getActive: () => this.request<any[]>(`${TRANSPORT_BASE_URL}/api/transport/requests/active`),
        getPending: () => this.request<any[]>(`${TRANSPORT_BASE_URL}/api/transport/requests/pending`),
        getById: (id: number) => this.request(`${TRANSPORT_BASE_URL}/api/transport/requests/${id}`),
        create: (request: any) => this.request(`${TRANSPORT_BASE_URL}/api/transport/requests`, { method: 'POST', body: JSON.stringify(request) }),
        assign: (id: number, porterId: string, porterName: string) => this.request(`${TRANSPORT_BASE_URL}/api/transport/requests/${id}/assign?porterId=${porterId}&porterName=${porterName}`, { method: 'POST' }),
        start: (id: number) => this.request(`${TRANSPORT_BASE_URL}/api/transport/requests/${id}/start`, { method: 'POST' }),
        complete: (id: number) => this.request(`${TRANSPORT_BASE_URL}/api/transport/requests/${id}/complete`, { method: 'POST' }),
        cancel: (id: number) => this.request(`${TRANSPORT_BASE_URL}/api/transport/requests/${id}/cancel`, { method: 'POST' }),
    };

    // Staff endpoints
    staff = {
        getAll: () => this.request<any[]>(`${STAFF_BASE_URL}/api/staff`),
        getById: (id: number) => this.request(`${STAFF_BASE_URL}/api/staff/${id}`),
        getByRole: (role: string) => this.request<any[]>(`${STAFF_BASE_URL}/api/staff/role/${role}`),
        search: (query: string) => this.request<any[]>(`${STAFF_BASE_URL}/api/staff/search?query=${query}`),
        create: (staff: any) => this.request(`${STAFF_BASE_URL}/api/staff`, { method: 'POST', body: JSON.stringify(staff) }),
    };

    shifts = {
        getAll: () => this.request<any[]>(`${STAFF_BASE_URL}/api/staff/shifts`),
        getByDate: (date: string) => this.request<any[]>(`${STAFF_BASE_URL}/api/staff/shifts/date/${date}`),
        getByWard: (ward: string) => this.request<any[]>(`${STAFF_BASE_URL}/api/staff/shifts/ward/${ward}`),
        getStaffRoster: (staffId: number, startDate: string, endDate: string) =>
            this.request<any[]>(`${STAFF_BASE_URL}/api/staff/shifts/roster/staff/${staffId}?startDate=${startDate}&endDate=${endDate}`),
        create: (shift: any) => this.request(`${STAFF_BASE_URL}/api/staff/shifts`, { method: 'POST', body: JSON.stringify(shift) }),
        checkIn: (id: number) => this.request(`${STAFF_BASE_URL}/api/staff/shifts/${id}/check-in`, { method: 'POST' }),
        checkOut: (id: number) => this.request(`${STAFF_BASE_URL}/api/staff/shifts/${id}/check-out`, { method: 'POST' }),
    };

    // Lab endpoints
    samples = {
        getAll: () => this.request<any[]>(`${LAB_BASE_URL}/api/lab/samples`),
        getActive: () => this.request<any[]>(`${LAB_BASE_URL}/api/lab/samples/active`),
        getById: (id: number) => this.request(`${LAB_BASE_URL}/api/lab/samples/${id}`),
        getInTransit: () => this.request<any[]>(`${LAB_BASE_URL}/api/lab/samples/in-transit`),
        getProcessing: () => this.request<any[]>(`${LAB_BASE_URL}/api/lab/samples/processing`),
        create: (sample: any) => this.request(`${LAB_BASE_URL}/api/lab/samples`, { method: 'POST', body: JSON.stringify(sample) }),
        collect: (id: number) =>
            this.request(`${LAB_BASE_URL}/api/lab/samples/${id}/collect?collectedById=SYSTEM&collectedByName=System&location=Collection Point`, { method: 'POST' }),
        receive: (id: number) => this.request(`${LAB_BASE_URL}/api/lab/samples/${id}/receive-at-lab`, { method: 'POST' }),
        receiveAtLab: (id: number) => this.request(`${LAB_BASE_URL}/api/lab/samples/${id}/receive-at-lab`, { method: 'POST' }),
        startProcessing: (id: number) => this.request(`${LAB_BASE_URL}/api/lab/samples/${id}/start-processing`, { method: 'POST' }),
        complete: (id: number, result: string) => this.request(`${LAB_BASE_URL}/api/lab/samples/${id}/complete`, { method: 'POST', body: result }),
        getMovements: (id: number) => this.request<any[]>(`${LAB_BASE_URL}/api/lab/samples/${id}/movements`),
    };
}

export const api = new ApiClient();
