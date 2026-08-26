function Student() {

    const student = {
        id: 101,
        name: "Abdul",
        age: 20
    };

    return (
        <div>
            <h2>ID : {student.id}</h2>
            <h2>Name : {student.name}</h2>
            <h2>Age : {student.age}</h2>
        </div>
    );
}

export default Student;
