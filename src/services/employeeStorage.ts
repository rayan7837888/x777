import { Employee } from '../types';

const EMPLOYEES_STORAGE_KEY = 'dodge_durango_employees_v1';

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-101',
    employeeCode: '101',
    fullName: 'ريان العتيبي',
    role: 'استشاري مبيعات أول - هيلكات وهيمي V8',
    phone: '0540773208',
    email: 'rayan.sales@dodge-ksa.com',
    branch: 'الرياض - طريق خريص',
    hireDate: '2024-01-15',
    status: 'active',
    notes: 'معتمد ومخول لتجارب دورانجو هيلكات 710 حصان وفعاليات الحلبات',
    ordersHandled: 24
  },
  {
    id: 'emp-202',
    employeeCode: '202',
    fullName: 'فهد الشمري',
    role: 'مسؤول تجارب القيادة والحلبات السريعة',
    phone: '0551234567',
    email: 'fahad.track@dodge-ksa.com',
    branch: 'جدة - طريق الكورنيش',
    hireDate: '2024-03-10',
    status: 'active',
    notes: 'مدرب حلبات معتمد ومسؤول فحص أنظمة Launch Control',
    ordersHandled: 19
  },
  {
    id: 'emp-303',
    employeeCode: '303',
    fullName: 'سلطان القحطاني',
    role: 'مدير مبيعات المعرض وكبار العملاء VIP',
    phone: '0509876543',
    email: 'sultan.vip@dodge-ksa.com',
    branch: 'الدمام - طريق الملك فهد',
    hireDate: '2023-11-01',
    status: 'active',
    notes: 'إشراف على حجوزات النسخ الخاصة Special Editions',
    ordersHandled: 38
  },
  {
    id: 'emp-707',
    employeeCode: '707',
    fullName: 'محمد الغامدي',
    role: 'كبير أخصائيي تجهيز وأداء دودج SRT',
    phone: '0567788990',
    email: 'mohammed.srt@dodge-ksa.com',
    branch: 'الرياض - الدائري الشمالي',
    hireDate: '2024-06-20',
    status: 'active',
    notes: 'مسؤول فحص أنظمة العادم والتجهيز الرياضي',
    ordersHandled: 12
  }
];

export const getEmployees = (): Employee[] => {
  try {
    const raw = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES));
      return INITIAL_EMPLOYEES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading employees:', err);
    return INITIAL_EMPLOYEES;
  }
};

export const saveEmployee = (employeeData: Omit<Employee, 'id'> & { id?: string }): Employee => {
  const employees = getEmployees();
  
  const newEmployee: Employee = {
    ...employeeData,
    id: employeeData.id || `emp-${Date.now()}`
  };

  const updated = [newEmployee, ...employees];
  try {
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving employee:', err);
  }

  return newEmployee;
};

export const updateEmployee = (id: string, updates: Partial<Employee>): Employee | null => {
  const employees = getEmployees();
  const index = employees.findIndex(e => e.id === id);
  if (index === -1) return null;

  const updatedEmployee = { ...employees[index], ...updates };
  employees[index] = updatedEmployee;

  try {
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
  } catch (err) {
    console.error('Error updating employee:', err);
  }

  return updatedEmployee;
};

export const deleteEmployee = (id: string): boolean => {
  const employees = getEmployees();
  const filtered = employees.filter(e => e.id !== id);
  try {
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Error deleting employee:', err);
    return false;
  }
};

export const terminateEmployee = (id: string, reason: string): Employee | null => {
  const employees = getEmployees();
  const index = employees.findIndex(e => e.id === id);
  if (index === -1) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const updatedEmployee: Employee = {
    ...employees[index],
    status: 'terminated',
    terminationDate: todayStr,
    terminationReason: reason.trim() || 'إنهاء خدمات وفصل بقرار إداري مباشر من الإدارة العليا'
  };

  employees[index] = updatedEmployee;

  try {
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
  } catch (err) {
    console.error('Error terminating employee:', err);
  }

  return updatedEmployee;
};

export const restoreEmployee = (id: string): Employee | null => {
  const employees = getEmployees();
  const index = employees.findIndex(e => e.id === id);
  if (index === -1) return null;

  const updatedEmployee: Employee = {
    ...employees[index],
    status: 'active',
    terminationDate: undefined,
    terminationReason: undefined
  };

  employees[index] = updatedEmployee;

  try {
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
  } catch (err) {
    console.error('Error restoring employee:', err);
  }

  return updatedEmployee;
};

export const findEmployeeByCode = (code: string): Employee | null => {
  const cleanCode = code.trim();
  const employees = getEmployees();
  return employees.find(e => e.employeeCode === cleanCode && e.status === 'active') || null;
};

export const getEmployeeByCodeAnyStatus = (code: string): Employee | null => {
  const cleanCode = code.trim();
  const employees = getEmployees();
  return employees.find(e => e.employeeCode === cleanCode) || null;
};

export const isCodeTaken = (code: string, excludeId?: string): boolean => {
  const employees = getEmployees();
  return employees.some(e => e.employeeCode === code.trim() && e.id !== excludeId);
};

export const generateUnique3DigitCode = (): string => {
  const employees = getEmployees();
  const usedCodes = new Set(employees.map(e => e.employeeCode));
  
  // Try generating starting from 100 to 999
  for (let codeNum = 100; codeNum <= 999; codeNum++) {
    const codeStr = String(codeNum);
    if (!usedCodes.has(codeStr)) {
      return codeStr;
    }
  }

  // Fallback random
  return String(Math.floor(100 + Math.random() * 900));
};

export const resetEmployeesToDefaults = (): Employee[] => {
  try {
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES));
  } catch (err) {
    console.error('Error resetting employees:', err);
  }
  return INITIAL_EMPLOYEES;
};
