import React, { useEffect, useState, useContext } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import LazyLoad from 'react-lazyload';

import EditMember from './EditMember';
import Member from './Member.js';
import subscriptionsUtils from '../../../Utils/SubscriptionUtils.js';
import common from '../../../Utils/Common.js';

const Loading = () => {
  return <div >
    <h5>Loading...</h5>
  </div>
};

function AllMembers(props) {

  const [errorMessage, setErrorMessage] = useState("");
  const [membersSubscriptionData, setMembersSubscriptionData] = useState([]);
  const history = useHistory();

  useEffect(() => {
    async function getAllMembersSubscriptionData() {
      let membersSubscriptionData;
      let memberId = props.match.params.memberId;
      if (memberId != null) {
        let results = await subscriptionsUtils.getAllMembersSubscriptionDataFilterByMemberId(memberId);
        if (results.isSuccess) {
          membersSubscriptionData = results.membersDataArr;
        }
        else {
          setErrorMessage(results.errorMessage);
        }
      }
      else {
        let results = await subscriptionsUtils.getAllMembersSubscriptionData();
        if (results.isSuccess) {
          membersSubscriptionData = results.membersDataArr;
        }
        else {
          setErrorMessage(results.errorMessage);
        }
      }
      setMembersSubscriptionData(membersSubscriptionData);
    }
    getAllMembersSubscriptionData();
  }, []);

  const onUserClickOnEditMember = (memberId) => {
    setMembersSubscriptionData([]);
    history.push(`${common.editMemberWithId}/${memberId}`);
  }

  const onUserClickOnDeleteMember = (memberId) => {
    debugger;
    let child = document.getElementById(memberId);
    let parent = document.getElementById('divMembers');
    parent.removeChild(child);
  }

  return (
    <div id="divMembers">
      {
        membersSubscriptionData?.map((memberSubscriptionData, key) => {
          return <div id={memberSubscriptionData.memberData.id}>
          <LazyLoad key={key} placeholder={<Loading />}>
            
              <Member key={key} memberSubscriptionData={memberSubscriptionData}
                onUserClickOnEditMemberCallback={(memberId) => { onUserClickOnEditMember(memberId) }}
                onUserClickOnDeleteMemberCallback={(memberId) => { onUserClickOnDeleteMember(memberId) }} />
           </LazyLoad>
          </div>
        })
      }
      {errorMessage}

      <Switch>
        <Route path={common.reload} component={null} key="reload" />
        <Route path={`${common.editMember}`} component={EditMember} />
      </Switch>
    </div>
  );
}
export default AllMembers;
