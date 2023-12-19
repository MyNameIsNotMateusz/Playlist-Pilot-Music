import "./styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

const About = () => {
    return (
        <Container>
            <div className="about-wrapper">
                <div className="about-left">
                    <div className="about-left-content">
                        <div>
                            <div className="shadow">
                                <div className="about-img">
                                    <img src="/about.jpg" alt="about image" />
                                </div>
                            </div>

                            <h2>Mateusz<br />Otorowski</h2>
                            <h3>Full-Stack Developer</h3>
                        </div>

                        <ul className="icons">
                            <li
                                onClick={() => {
                                    window.open('https://www.linkedin.com/in/mateusz-otorowski-28721b278/', '_blank');
                                }}
                            ><i className="fab fa-linkedin"></i></li>
                            <li
                                onClick={() => {
                                    window.open('https://github.com/MyNameIsNotMateusz', '_blank');
                                }}
                            ><i className="fab fa-github"></i></li>
                        </ul>
                    </div>
                </div>

                <div className="about-right">
                    <h1>hi<span>!</span></h1>
                    <h2>Here's who I am & what I do</h2>
                    <div className="about-btns">
                        <button type="button" className="contactBtn contactBtn-blue"
                            onClick={() => {
                                window.open('/Mateusz_Otorowski_CV.pdf')
                            }}
                        >resume</button>
                        <button type="button" className="contactBtn contactBtn-white"
                            onClick={() => {
                                window.open('https://mynameisnotmateusz.github.io/Personal-Homepage-new/projects.html', '_blank');
                            }}

                        >projects</button>
                    </div>

                    <div className="about-para">
                        <p>I'm a self-taught programmer who finds immense joy in coding. I'm dedicated to becoming the best I can be in the field, and currently, I work as a Software Developer.</p>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default About;