import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/styles/Contact.css';


const EditContact = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        time: '',
        comments: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [message, setMessage] = useState(null)


    useEffect(() => {
        const fetchContact = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/contact/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                 setFormData(prevData => ({
                    ...prevData,
                    name: data.name,
                    phone: data.phone,
                    date: data.date.substring(0, 10),
                    time: data.time,
                     comments: data.comments,
                }))
            } catch (error) {
                console.error('Error fetching contact:', error);
            }
        };
        fetchContact();
    }, [id]);
    const handleChange = (e) => {
          const { name, value} = e.target;
           setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
     const validateForm = () => {
        let errors = {};
         if (!formData.name.trim()) {
             errors.name = 'Name is required';
          }
          if (!formData.phone.trim()) {
                errors.phone = 'Phone number is required';
            }else if (!/^[0-9]{10}$/.test(formData.phone)) {
              errors.phone = 'Please enter a valid 10-digit phone number';
            }
           if (!formData.date) {
               errors.date = 'Date is required';
          }
            if (!formData.time) {
                errors.time = 'Time is required';
           }

         setFormErrors(errors);
            return Object.keys(errors).length === 0;
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(validateForm()){
        try {
            const response = await fetch(`http://localhost:3000/api/contact/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    date: formData.date,
                    time: formData.time,
                    comments: formData.comments,
                }),
            });

            if (response.ok) {
                  setMessage("Reservation updated successfully")
                  setTimeout(()=> navigate('/contact'),2000)
            } else {
                   setMessage("Error in updating reservation")
               }

        } catch (error) {
            console.error('Error updating contact:', error);
        }
    }
};
    const clearForm = () => {
         setFormData({
            name: '',
            phone: '',
            date: '',
            time: '',
            comments: '',
        });
          setFormErrors({});
    };
    return (
        <main className="content" role="main">
            <div className="reservation-form-container">
                <form onSubmit={handleSubmit} id="reservationForm" className="reservationForm-form">
                    <fieldset className="fieldset">
                        <legend>Edit Reservation Information</legend>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        {formErrors.name && <span className="error">{formErrors.name}</span>}


                        <label htmlFor="phone">Phone no.:</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            pattern="[0-9]{10}"
                            maxLength="10"
                            title="Please enter a valid 10-digit phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                           {formErrors.phone && <span className="error">{formErrors.phone}</span>}

                        <label htmlFor="date">Date:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                           {formErrors.date && <span className="error">{formErrors.date}</span>}
                          <label htmlFor="time">Time:</label>
                        <input
                            id="time"
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                        />
                            {formErrors.time && <span className="error">{formErrors.time}</span>}



                        <label htmlFor="needs">Comments:</label>
                        <textarea
                            id="needs"
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                        ></textarea>

                        <button type="submit" className="reserve-btn">Update</button>
                        <button type="reset" className="reset-btn" onClick={clearForm}>
                            Reset
                        </button>
                    </fieldset>
                    {message && (
                        <div className="messages">
                            <div className="message">
                                {message}
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </main>
    );
};

export default EditContact;