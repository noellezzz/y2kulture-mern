class Student:
    def __init__(self, name, student_id, grade):
        self.name = name
        self.student_id = student_id
        self.grade = grade
    def get_info(self):
        return f"ID: {self.student_id}, Name: {self.name}, Grade: {self.grade}"
class StudentManager:
    def __init__(self):
        self.students = []
    def add_student(self, student):
        self.students.append(student)
    def save_to_file(self):
        with open("students.txt", "w") as file:
            for student in self.students:
                file.write(student.get_info() + "\n")
        print("Student list saved to students.txt.")
    def load_from_file(self):
        try:
            with open("students.txt", "r") as file:
                print("Student List:")
                for line in file:
                    print(line.strip())
        except FileNotFoundError:
            print("No saved student list found.")
manager = StudentManager()
while True:
    print("\n1. Add Student")
    print("2. View All Students")
    print("3. Save Student List")
    print("4. Load Student List")
    print("5. Exit")
    choice = input("Enter your choice: ")
    if choice == "1":
        name = input("Enter student name: ")
        student_id = input("Enter student ID: ")
        grade = input("Enter student grade: ")
        student = Student(name, student_id, grade)
        manager.add_student(student)
        print("Student added.")
    elif choice == "2":
        print("All Students:")
        for student in manager.students:
            print(student.get_info())
    elif choice == "3":
        manager.save_to_file()
    elif choice == "4":
        manager.load_from_file()
    elif choice == "5":
        print("Exiting program.")
        break
    else:
        print("Invalid choice. Please try again.")
