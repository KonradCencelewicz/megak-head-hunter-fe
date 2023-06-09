import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
    HumanResourcesSingleDetailedStudent
} from '../HumanResourcesSingleDetailedStudent/HumanResourcesSingleDetailedStudent';
import {useRemoveFromToTalkMutation, useToTalkMutation} from "../../../api/toTalkApiSlice";
import {StudentsToTalkList} from 'types'



interface Props {
    page: number;
    limitOnPage: number;
    setLimitOnPage: Dispatch<SetStateAction<number>>;
    setMaxStudentsNumber: Dispatch<SetStateAction<number>>;
}

interface ToTalkList {
    githubUsername: string;
    id: string;
    name: string;
    reservation: string;
    picture: string;
    courseCompletion: number;
    courseEngagment: number;
    projectDegree: number;
    teamProjectDegree: number;
    expectedTypeWork: number;
    targetWorkCity: string;
    expectedContractType: number;
    expectedSalary: number;
    canTakeApprenticeship: number;
    monthsOfCommercialExp: number;
}


export const HumanResourcesToTalkStudents = ({page, limitOnPage, setMaxStudentsNumber, setLimitOnPage}: Props) => {
    const [toTalk, {isLoading, isError, error}] = useToTalkMutation()
    const [toTalkList, setToTalkList] = useState<ToTalkList[]>()
    const [errorResponse, setErrorResponse] = useState('')
    const [removeFromToTalk] = useRemoveFromToTalkMutation()

    const handleRemoveStudentFromTalkList = async (id: string) => {
        await removeFromToTalk(id)
        setLimitOnPage(prev => --prev)
    }
    useEffect(() => {
        try {
            (async () => {
                const limit = limitOnPage
                const result = await toTalk({page, limit})
                // @ts-ignore
                const studentsToTalkList = result.data as StudentsToTalkList[]
                setMaxStudentsNumber(studentsToTalkList.length)
                setToTalkList(studentsToTalkList.map(el => ({
                    id: el.id,
                    name: `${el.firstName} ${el.lastName}`,
                    reservation: String(el.toDate),
                    picture: `${el.githubUsername}.png`,
                    canTakeApprenticeship: el.canTakeApprenticeship,
                    monthsOfCommercialExp: el.monthsOfCommercialExp,
                    courseEngagment: el.courseEngagment,
                    projectDegree: el.projectDegree,
                    teamProjectDegree: el.teamProjectDegree,
                    targetWorkCity: el.targetWorkCity,
                    expectedTypeWork: el.expectedTypeWork,
                    courseCompletion: el.courseCompletion,
                    expectedContractType: el.expectedContractType,
                    expectedSalary: el.expectedSalary,
                    githubUsername: el.githubUsername,
                })))
            })()
        } catch (e) {
            setErrorResponse('Coś poszło nie tak, spróbuj ponownie później...')
        }
    }, [limitOnPage, page])


    return (
        <div className='human-resources-to-talk-students'>
            {isLoading && <h2 className={'error'}>wczytywanie listy</h2>}
            {errorResponse && <h2 className={'error'}>{errorResponse}</h2>}
            {setToTalkList.length === 0 && <h2 className={'error'}>Brak kursantów do wyświetlenia...</h2>}
            {toTalkList?.map((person, index) => (
                <HumanResourcesSingleDetailedStudent
                    key={index}
                    {...person}
                    id={person.id}
                    handleRemoveStudentFromTalkList={handleRemoveStudentFromTalkList}/>
            ))}
        </div>
    );
};
