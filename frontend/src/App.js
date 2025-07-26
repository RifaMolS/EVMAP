import logo from "./logo.svg";
import "./App.css";
import Main from "./Homepage/Main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicStation from "./Homepage/PublicStation";
import ChargingPoint from "./Homepage/ChargingPoint";
import HomeCharging from "./Homepage/HomeCharging";
import SignUp from "./Homepage/SignUp";
import Signin from "./Homepage/Signin";
import Home from "./Admin/Home";
import Station from "./Homepage/Station";
import EditMech from "./Admin/EditMech";
import { useState } from "react";
import MainStat from "./Station/MainStat";
import About from "./Homepage/About";
import Contact from "./Homepage/Contact";
import SlotEdit from "./Station/SlotEdit";
import AllSlots from "./Station/AllSlots";
import ViewSlot from "./Homepage/ViewSlot";
import Logout from "./Homepage/Logout";
import MechanicView from "./Homepage/MechanicView";
import StationOwnerReg from "./Homepage/StationOwnerReg";
import Mechanic from "./Admin/Mechanic";
import SlotModal from "./Station/SlotModal";
import Profile from "./Homepage/Profile";
import Profileedit from "./Homepage/Profileedit";
import Aboutus from "./Homepage/Aboutus";
import PayBooking from "./Homepage/PayBooking";
import CarCondition from "./Homepage/CarCondition";
import BookingHistory from "./Homepage/BookingHistory";
import Complaint from "./Homepage/Complaint";
import ViewReply from "./Homepage/ViewReply";
import Trip from "./Homepage/Trip";
import ForgotPassword from "./Homepage/ForgotPassword";
import ResetPassword from "./Homepage/ResetPassword";


import StationIndDashboard from "./StationIndividual/StationIndDashboard";
import SlotHistory from "./StationIndividual/SlotHistory";

function App() {
  const [auth, setAuth] = useState(
    JSON.parse(localStorage.getItem("yourstorage"))
  );

  return (
    <>
      <BrowserRouter>
        {auth == null ? (
          <>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/publicstation" element={<PublicStation />} />
              <Route path="/charge" element={<ChargingPoint />} />
              <Route path="/homecharge" element={<HomeCharging />} />
              <Route path="/station" element={<Station />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/stationregister" element={<StationOwnerReg />} />
              <Route path="/about" element={<Aboutus />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
        
            </Routes>
          </>
        ) : auth.usertype == 3 ? (
          <>
            <Routes>
              <Route path="/" element={<MainStat />} />
              <Route path="/slotedit" element={<SlotEdit />} />
              <Route path="/addslot" element={<SlotModal />} />
            </Routes>
          </>
        ) : auth.usertype == 0 ? (
          <>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/slots" element={<ViewSlot />} />
              <Route path="/station" element={<Station />} />
              <Route path="/viewmech" element={<MechanicView />} />
              <Route path="/carcondition" element={<CarCondition />} />
              <Route path="/bookinghistory" element={<BookingHistory />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/trip" element={<Trip/>}/>
              <Route path="/profileedit" element={<Profileedit />} />
              <Route path="/complaint" element={<Complaint />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/paybooking" element={<PayBooking />} />
              <Route path="/viewcomplaint" element={<ViewReply />} />

            </Routes>
          </>
        ) : auth.usertype == 2 ? (
          <>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/addmech" element={<Mechanic />} />
              <Route path="/edit" element={<EditMech />} />
            </Routes>
          </>
        ) : auth.usertype == 1 ? (
          <>
            <Routes>
              <Route path="/" element={<StationIndDashboard />} />
              <Route path="/slotedit" element={<SlotEdit />} />
              <Route path="/addslot" element={<SlotModal />} />
              <Route path="/slothistory/:id" element={<SlotHistory />} />
            </Routes>
          </>
        ) : null}
      </BrowserRouter>
    </>
  );
}

export default App;
