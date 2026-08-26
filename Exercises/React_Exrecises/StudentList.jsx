function StudentList() {

    const students = ["Abdul", "Rahul", "Kavin", "John"];

    return (
        <div>

            <h2>Students</h2>

            <ul>
                {students.map((student, index) => (
                    <li key={index}>{student}</li>
                ))}
            </ul>

        </div>
    );
}

export default StudentList;
