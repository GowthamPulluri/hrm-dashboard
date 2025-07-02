// app/Add_Update_employee/page.js
import { Suspense } from "react";
import Add_Update_employee from "./helper";

export default function AddUpdateEmployeePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-white">Loading employee form...</div>}>
      <Add_Update_employee />
    </Suspense>
  );
}