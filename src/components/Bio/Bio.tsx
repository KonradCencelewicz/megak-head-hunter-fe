import {useEffect, useState} from 'react';
import staticText from '../../languages/en.pl';
import logoGithub from '../../utils/img/github.png';
import {ContractType, choiceYesNO} from 'types';
import {checkGitHubAccount} from '../../utils/checkGitHubAccount/checkGitHubAccount';
import {SubmitButton} from "../common/Button/SubmitButton";
import {useRemoveFromToTalkMutation} from "../../api/toTalkApiSlice";
import {useNavigate} from "react-router";
import {useStudentHiredMutation} from "../../api/updateStudentDataApiSlice";

type Props = {
    id: string;
    email: string;
    courseCompletion: number;
    courseEngagment: number;
    projectDegree: number;
    teamProjectDegree: number;
    tel: string;
    firstName: string;
    lastName: string;
    githubUsername: string;
    portfolioUrls: string[];
    projectUrls: string[];
    bio: string;
    expectedContractType: ContractType;
    expectedSalary: number;
    canTakeApprenticeship: choiceYesNO;
    monthsOfCommercialExp: number;
    education: string;
    workExperience: string;
};

export const Bio = ({id,githubUsername='',firstName,lastName,tel,email,bio}: Props) => {
    const navigate = useNavigate()
    const [gitHubAccountTrue, setGitHubAccountTrue] = useState(false);
    const [removeFromToTalk] = useRemoveFromToTalkMutation()
    const [studentHired] = useStudentHiredMutation()
    const handleRemoveFromToTalkList = async () => {
        await removeFromToTalk(id)
        navigate('/hr')
    }
   const handleStudentStatusChange = async () => {
        await studentHired(id);
        navigate('/hr')
    }
    const handleReturnToMainPage = ()=>{
        navigate('/hr')
    }
    useEffect(() => {
        (async () => {
            const checkGitHub = await checkGitHubAccount(githubUsername);
            checkGitHub === 200 && setGitHubAccountTrue(true);
        })();
    }, []);

    return (
        <div className='bio'>
            <div className='bio__img'>
                <img
                    src={
                        gitHubAccountTrue
                            ? `https://github.com/${githubUsername}.png`
                            : require('../../utils/img/github.png')
                    }
                    alt='avatar'
                />
            </div>

            <div className='bio__details'>
                <p className='bio__name'>{`${firstName} ${lastName}`}</p>
                <a
                    href={`https://github.com/${gitHubAccountTrue}`}
                    className='bio__link'
                    target='_blank'
                    rel='noreferrer'
                >
                    <img src={logoGithub} alt='logo' className='bio__logo'/>
                    {/* name to take from backend */}
                    <span className='bio__link-name'>{githubUsername}</span>
                </a>
            </div>

            <div className='bio__contact'>
                <p className='bio__contact-details'>
                    <span className='material-symbols-outlined'>call</span>
                    {tel}
                    {/* +48 566 972 227 */}
                </p>
                <p className='bio__contact-details'>
                    <span className='material-symbols-outlined'>mail</span>
                    {email}
                    {/* jankowalski@gmail.com */}
                </p>
            </div>

            <div className='bio__about-me'>
                <p className='bio__about-me-header'>
                    {staticText.mainPages.text.aboutMe}
                </p>
                <p>
                    {bio}
                    {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
          quisquam architecto mollitia reprehenderit Aut, doloremque eum
          repellendus, minus quis corrupti laudantium laborum sit nostrum
          suscipit sunt nemo eveniet fugit ullam. */}
                </p>
            </div>

            <div className='bio__buttons'>
                <SubmitButton handleClick={handleRemoveFromToTalkList} text={staticText.mainPages.button.noInterest}/>
                <SubmitButton handleClick={handleStudentStatusChange} text={staticText.mainPages.button.employed}/>
                <SubmitButton handleClick={handleReturnToMainPage} text={'Powrót'} />
            </div>
        </div>
    );
};
