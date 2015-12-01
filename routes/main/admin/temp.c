using UnityEngine;

public class CameraControl : MonoBehaviour
{
    public float m_DampTime = 0.2f;                 // 카메라가 초점을 다시 잡는 시간을 지정하는 변수
    public float m_ScreenEdgeBuffer = 4f;           // 위, 아래의 여백 값
    public float m_MinSize = 6.5f;                  // 카메라의 미니멈 직각 크기 값
    [HideInInspector] public Transform[] m_Targets; // 모든 대상을 잡는 카메라 배열
    
    
    private Camera m_Camera;                        // 카메라 참조시 사용하는 변수
    private float m_ZoomSpeed;                      // 부드러운 줌 속도 ???
    private Vector3 m_MoveVelocity;                 // 위치의 부드러운 제동에 대한 기준 속도 ???? 
    private Vector3 m_DesiredPosition;              // 움직이는 쪽으로 이동하는 카메라 위치 변수
    
    
    private void Awake ()
    {
        m_Camera = GetComponentInChildren<Camera> ();
    }
    
    
    private void FixedUpdate ()
    {
        // 원하는 위치를 향해 카메라를 이동하는 함수
        Move ();
        
        // 카메라에 종속적으로 줌 크기를 변경하는 함수
        Zoom ();
    }
    
    
    private void Move ()
    {
        // 대상 타겟들의 평균 위치를 찾는 함수
        FindAveragePosition ();
        
        // Vector3 라이브러리 내 SmoothDamp함수를 사용하여 원하는 위치로 부드럽게 전환 하여 줌
        transform.position = Vector3.SmoothDamp(transform.position, m_DesiredPosition, ref m_MoveVelocity, m_DampTime);
    }
    
    
    private void FindAveragePosition ()
    {
        Vector3 averagePos = new Vector3 ();
        int numTargets = 0;
        
        // Go through all the targets and add their positions together.
        // 모든 대상들의 이동을 통해 함께 있는 자신의 위치를 추가한다?
        for (int i = 0; i < m_Targets.Length; i++)
        {
            // 대상이 움직이지 않는다면 다음 단계로 이동한다.
            if (!m_Targets[i].gameObject.activeSelf)
                continue;
            
            // Add to the average and increment the number of targets in the average.
            // 평균 값을 증가시키고
            averagePos += m_Targets[i].position;
            // 아래 해당하는 변수 값을 증가시킨다.
            numTargets++;
        }
        
        // If there are targets divide the sum of the positions by the number of them to find the average.
        // 목표물이 있는 경우(플레이어) 평균 위치를 조정하기 위해 평균 값을 플레이어 숫자로 나눈다.
        if (numTargets > 0)
            averagePos /= numTargets;
        
        // Keep the same y value.
        // 같은 y값을 유지
        averagePos.y = transform.position.y;
        
        // The desired position is the average position;
        // m_DesiredPosition 변수에 위에서 구한 평균 값을 대입하여 준다.
        m_DesiredPosition = averagePos;
    }
    
    
    private void Zoom ()
    {
        // Find the required size based on the desired position and smoothly transition to that size.
        // FindAveragePosition 함수에서 구한 m_DesiredPosition 변수에 기반하여 구한 사이즈로 줌을 조절한다.
        float requiredSize = FindRequiredSize();
        m_Camera.orthographicSize = Mathf.SmoothDamp (m_Camera.orthographicSize, requiredSize, ref m_ZoomSpeed, m_DampTime);
    }
    
    
    private float FindRequiredSize ()
    {
        // Find the position the camera rig is moving towards in its local space.
        // 카메라 장비가 이동하는 공간으로의 위치를 찾는다?
        Vector3 desiredLocalPos = transform.InverseTransformPoint(m_DesiredPosition);
        
        // Start the camera's size calculation at zero.
        // 카메라 사이즈 계산을 위한 변수 초기화
        float size = 0f;
        
        // Go through all the targets...
        // 모든 대상을 향해 이동한다.
        for (int i = 0; i < m_Targets.Length; i++)
        {
            // ... and if they aren't active continue on to the next target.
            // 그들의 다음 타겟이 활성화되지 않았을 경우?
            if (!m_Targets[i].gameObject.activeSelf)
                continue;
            
            // Otherwise, find the position of the target in the camera's local space.
            // 타겟이 활성화 된 경우 로컬 공간에서 타겟의 포지션을 값을 가져온다.
            Vector3 targetLocalPos = transform.InverseTransformPoint(m_Targets[i].position);
            
            // Find the position of the target from the desired position of the camera's local space.
            // 
            Vector3 desiredPosToTarget = targetLocalPos - desiredLocalPos;
            
            // Choose the largest out of the current size and the distance of the tank 'up' or 'down' from the camera.
            size = Mathf.Max(size, Mathf.Abs(desiredPosToTarget.y));
            
            // Choose the largest out of the current size and the calculated size based on the tank being to the left or right of the camera.
            size = Mathf.Max(size, Mathf.Abs(desiredPosToTarget.x) / m_Camera.aspect);
        }
        
        // Add the edge buffer to the size.
        size += m_ScreenEdgeBuffer;
        
        // Make sure the camera's size isn't below the minimum.
        size = Mathf.Max (size, m_MinSize);
        
        return size;
    }
    
    
    public void SetStartPositionAndSize ()
    {
        // Find the desired position.
        FindAveragePosition ();
        
        // Set the camera's position to the desired position without damping.
        transform.position = m_DesiredPosition;
        
        // Find and set the required size of the camera.
        m_Camera.orthographicSize = FindRequiredSize ();
    }
}