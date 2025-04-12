<?php
require 'vendor/autoload.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5174');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$input = json_decode(file_get_contents('php://input'), true);

// Kiểm tra dữ liệu đầu vào
if (!isset($input['totalRevenue']) || !isset($input['appointmentCount']) || 
    !isset($input['patientCount']) || !isset($input['appointments'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required data']);
    exit;
}

$totalRevenue = filter_var($input['totalRevenue'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
$appointmentCount = filter_var($input['appointmentCount'], FILTER_SANITIZE_NUMBER_INT);
$patientCount = filter_var($input['patientCount'], FILTER_SANITIZE_NUMBER_INT);
$appointments = $input['appointments'];

// Sử dụng đường dẫn tuyệt đối
$baseDir = dirname(__DIR__); // Lấy thư mục gốc của WampServer (C:\wamp64\www)
$reportDir = $baseDir . '/php-services/reports/';
if (!is_dir($reportDir)) {
    if (!mkdir($reportDir, 0777, true)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to create reports directory',
            'error' => error_get_last()
        ]);
        exit;
    }
}

$fileName = 'dashboard_report_' . date('Ymd_His') . '.pdf';
$filePath = $reportDir . $fileName;

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];
$basePath = dirname($_SERVER['REQUEST_URI']);
$fileUrl = "$protocol://$host$basePath/reports/$fileName";

try {
    // Kiểm tra quyền ghi
    if (!is_writable($reportDir)) {
        throw new Exception("Directory $reportDir is not writable");
    }

    $pdf = new \TCPDF();
    $pdf->AddPage();
    $pdf->SetFont('dejavusans', '', 12);

    // Tiêu đề báo cáo
    $pdf->Cell(0, 10, 'Báo cáo Dashboard Bác sĩ', 0, 1, 'C');
    $pdf->Ln(5);

    // Thông tin tóm tắt
    $pdf->Cell(0, 10, "Tổng thu nhập: " . number_format($totalRevenue, 0, ',', '.') . " VND", 0, 1);
    $pdf->Cell(0, 10, "Số cuộc hẹn: $appointmentCount", 0, 1);
    $pdf->Cell(0, 10, "Số bệnh nhân: $patientCount", 0, 1);
    $pdf->Ln(10);

    // Lọc danh sách cuộc hẹn hoàn thành và bị hủy
    $completedAppointments = array_filter($appointments, function($appt) {
        return isset($appt['isCompleted']) && $appt['isCompleted'] === true;
    });

    $cancelledAppointments = array_filter($appointments, function($appt) {
        return isset($appt['cancelled']) && $appt['cancelled'] === true;
    });

    // Bảng 1: Danh sách cuộc hẹn hoàn thành
    if (!empty($completedAppointments)) {
        $pdf->SetFont('dejavusans', 'B', 12);
        $pdf->Cell(0, 10, 'Danh sách cuộc hẹn hoàn thành', 0, 1);
        $pdf->SetFont('dejavusans', '', 10);

        // Tiêu đề bảng
        $pdf->Cell(20, 10, 'STT', 1, 0, 'C');
        $pdf->Cell(80, 10, 'Tên bệnh nhân', 1, 0, 'C');
        $pdf->Cell(70, 10, 'Thời gian', 1, 1, 'C');

        // Dữ liệu bảng
        $index = 1;
        foreach ($completedAppointments as $appt) {
            $patientName = isset($appt['userData']['name']) ? $appt['userData']['name'] : 'Không xác định';
            $time = $appt['slotDate'] . ', ' . $appt['slotTime'];
            $pdf->Cell(20, 10, $index, 1, 0, 'C');
            $pdf->Cell(80, 10, $patientName, 1, 0);
            $pdf->Cell(70, 10, $time, 1, 1);
            $index++;
        }
        $pdf->Ln(10);
    }

    // Bảng 2: Danh sách cuộc hẹn bị hủy
    if (!empty($cancelledAppointments)) {
        $pdf->SetFont('dejavusans', 'B', 12);
        $pdf->Cell(0, 10, 'Danh sách cuộc hẹn bị hủy', 0, 1);
        $pdf->SetFont('dejavusans', '', 10);

        // Tiêu đề bảng
        $pdf->Cell(20, 10, 'STT', 1, 0, 'C');
        $pdf->Cell(80, 10, 'Tên bệnh nhân', 1, 0, 'C');
        $pdf->Cell(70, 10, 'Thời gian', 1, 1, 'C');

        // Dữ liệu bảng
        $index = 1;
        foreach ($cancelledAppointments as $appt) {
            $patientName = isset($appt['userData']['name']) ? $appt['userData']['name'] : 'Không xác định';
            $time = $appt['slotDate'] . ', ' . $appt['slotTime'];
            $pdf->Cell(20, 10, $index, 1, 0, 'C');
            $pdf->Cell(80, 10, $patientName, 1, 0);
            $pdf->Cell(70, 10, $time, 1, 1);
            $index++;
        }
    }

    // Xuất file PDF
    $pdf->Output($filePath, 'F');

    if (!file_exists($filePath)) {
        throw new Exception('Failed to save PDF file');
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Report generated successfully',
        'fileUrl' => $fileUrl,
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to generate report: ' . $e->getMessage(),
        'error' => error_get_last()
    ]);
}
?>