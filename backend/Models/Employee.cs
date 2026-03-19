using System;
using System.Collections.Generic;

namespace TechNovaAPI.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string EmployeeCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTime? DOB { get; set; }
        public decimal Salary { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public object DateOfBirth { get; internal set; }
        public int Age { get; internal set; }
    }
}