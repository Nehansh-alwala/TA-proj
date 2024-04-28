import { useEffect, useState } from 'react';
import supabase from '../../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './Adminnav';
import { Chart } from 'react-google-charts';
import Spinner from '../spinner';
import { Text } from '@mantine/core';

const AdministratorPage = ({token}) => {
  let navigate = useNavigate();
  const [isSpinner, setIsSpinner] = useState(false);

  function handleLogout(){
    localStorage.removeItem('token');
    navigate('/');
  }

  const [totalApplications, setTotalApplications] = useState(0);
  const [courseApplicationsMap, setCourseApplicationsMap] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsSpinner(true);
        // Fetch total applications
        const totalResponse = await supabase.from('coursesapp').select('*', { count: 'exact' });

        if (totalResponse.error) {
          throw totalResponse.error;
        }

        const totalCount = totalResponse.data ? totalResponse.data.length : 0;
        setTotalApplications(totalCount);

        // Fetch count of applications for each course
        const coursesResponse = await supabase.from('courses').select('title');
        if (coursesResponse.error) {
          throw coursesResponse.error;
        }
        const courses = coursesResponse.data.map(course => course.title);

        const courseApplications = [];
        for (const course of courses) {
          const { count, error: countError } = await supabase
            .from('coursesapp')
            .select('*', { count: 'exact' })
            .eq('courseName', course);

          if (countError) {
            throw countError;
          }

          courseApplications.push([course, count || 0]);
        }

        setCourseApplicationsMap(courseApplications);
        setIsSpinner(false);
      } catch (error) {
        setIsSpinner(false);
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
    {isSpinner && <Spinner />}
      <div className="admin-page">
        <div className="applications-container">
          <Text ta="center" fz="h1" c="#0056b3" pt="lg" pb="lg" fw="bold">Total Applications Received: {totalApplications}</Text>
        </div>
        <div className="courses-container">
          <Chart
            width={'1000px'}
            height={'500px'}
            chartType="Bar"
            loader={<div>Loading Chart</div>}
            data={[
              ['Course', 'Applications'],
              ...courseApplicationsMap
            ]}
            options={{
              chart: {
                title: 'Applications Information',
                subtitle: 'Number of applications received per course',
              },
            }}
            rootProps={{ 'data-testid': '1' }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdministratorPage;
