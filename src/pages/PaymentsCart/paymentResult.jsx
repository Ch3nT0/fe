import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const responseCode = searchParams.get("vnp_ResponseCode");
  const transactionStatus = searchParams.get("vnp_TransactionStatus");

  useEffect(() => {
    if (responseCode === "00" && transactionStatus === "00") {
      alert("Thanh toán thành công!");
    } else {
      alert("Thanh toán thất bại!");
    }
  }, [responseCode, transactionStatus]);

  return (
    <div>
      <h2>Kết quả thanh toán</h2>
      {responseCode === "00" ? (
        <p> Giao dịch thành công!</p>
      ) : (
        <p>Giao dịch thất bại!</p>
      )}
    </div>
  );
};

export default PaymentResult;