using System;

namespace TechNovaAPI.Models
{
    public class Department
    {
        public int Id { get; set; }
        public string DepartmentCode { get; set; }
        public string DepartmentName { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsActive { get; set; }
    }
}