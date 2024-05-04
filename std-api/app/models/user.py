from typing import Optional

from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str = None


class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)  # 아이디
    password: str = Field(index=False)  # 비밀번호
    email: str = Field(default=None, index=True)  # 이메일
    full_name: str  # 이름
    birth_date: Optional[str] = None  # 생년월일
    zip_code: Optional[str] = None  # 우편번호
    address: Optional[str] = None  # 주소
    address_extra: Optional[str] = None  # 주소
    phone_number: Optional[str] = None  # 전화번호
    hp_number: Optional[str] = None  # 휴대폰번호
    user_type: Optional[str] = None  # 사용자 타입 (center, teacher, parent, student)
    is_active: Optional[bool] = Field(default=True)  # 활성화 여부
    is_superuser: Optional[bool] = Field(default=False)  # 관리자 여부

    # # 센터관련 추가 정보
    # center_name: Optional[str] = None  # 센터명
    # center_type: Optional[str] = None  # 센터유형
    # center_address: Optional[str] = None  # 센터주소
    # center_address_extra: Optional[str] = None  # 센터주소
    # center_phone_number: Optional[str] = None  # 센터전화번호
    # center_hp_number: Optional[str] = None  # 센터휴대폰번호
    # center_fax_number: Optional[str] = None  # 센터팩스번호
    # center_email: Optional[str] = None  # 센터이메일
    # center_homepage: Optional[str] = None  # 센터홈페이지
    # center_zipcode: Optional[str] = None  # 센터우편번호
    # center_establish_date: Optional[str] = None  # 개설일
    # center_license_number: Optional[str] = None  # 인가번호
    # center_license_date: Optional[str] = None  # 인가일
    # center_license_valid_date: Optional[str] = None  # 인가유효기간
    # center_license_type: Optional[str] = None  # 인가유형
    # center_license_status: Optional[str] = None  # 인가상태
    # center_license_agency: Optional[str] = None  # 인가기관
    # # 교사관련 추가 정보
    # teacher_rank: Optional[str] = None  # 교사직급
    # teacher_type: Optional[str] = None  # 교사유형
    # teacher_address: Optional[str] = None  # 교사주소
    # teacher_address_extra: Optional[str] = None  # 교사주소
    # teacher_phone_number: Optional[str] = None  # 교사전화번호
    # teacher_hp_number: Optional[str] = None  # 교사휴대폰번호
    # teacher_email: Optional[str] = None  # 교사이메일
    # teacher_zipcode: Optional[str] = None  # 교사우편번호
    # teacher_license_number: Optional[str] = None  # 교사자격증번호
    # teacher_license_date: Optional[str] = None  # 교사자격증발급일
    # teacher_license_valid_date: Optional[str] = None  # 교사자격증유효기간
    # teacher_license_type: Optional[str] = None  # 교사자격증유형
    # teacher_license_status: Optional[str] = None  # 교사자격증상태
    # teacher_license_agency: Optional[str] = None  # 교사자격증기관
    # # 학생관련 추가 정보
    # parent_name: Optional[str] = None  # 부모명
    # parent_hp_number: Optional[str] = None  # 부모휴대폰번호
    # parent_email: Optional[str] = None  # 부모이메일
    # status: Optional[str] = None  # 상태 (대기, 등록, 종료)
    # disability_type: Optional[str] = None  # 장애유형
    # initial_consult_date: Optional[str] = None  # 초기상담일
    # referral_path: Optional[str] = None  # 유입경로
    # last_login: Optional[str] = None  # 마지막 로그인일
    # created_at: Optional[str] = None  # 생성일
    # updated_at: Optional[str] = None  # 수정일
    # deleted_at: Optional[str] = None  # 삭제일


class UserCreate(UserBase):
    pass


class UserUpdate(SQLModel):
    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None
    full_name: Optional[int] = None
    birth_date: Optional[str] = None  # 생년월일
    address: Optional[str] = None  # 주소
    address_extra: Optional[str] = None  # 주소
    phone_number: Optional[str] = None  # 전화번호
    hp_number: Optional[str] = None  # 휴대폰번호
    user_type: Optional[str] = None  # 사용자 타입 (center, teacher, parent, student)
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)

    # # 센터관련 추가 정보
    # center_name: Optional[str] = None  # 센터명
    # center_type: Optional[str] = None  # 센터유형
    # center_address: Optional[str] = None  # 센터주소
    # center_address_extra: Optional[str] = None  # 센터주소
    # center_phone_number: Optional[str] = None  # 센터전화번호
    # center_hp_number: Optional[str] = None  # 센터휴대폰번호
    # center_fax_number: Optional[str] = None  # 센터팩스번호
    # center_email: Optional[str] = None  # 센터이메일
    # center_homepage: Optional[str] = None  # 센터홈페이지
    # center_zipcode: Optional[str] = None  # 센터우편번호
    # center_establish_date: Optional[str] = None  # 개설일
    # center_license_number: Optional[str] = None  # 인가번호
    # center_license_date: Optional[str] = None  # 인가일
    # center_license_valid_date: Optional[str] = None  # 인가유효기간
    # center_license_type: Optional[str] = None  # 인가유형
    # center_license_status: Optional[str] = None  # 인가상태
    # center_license_agency: Optional[str] = None  # 인가기관
    # # 교사관련 추가 정보
    # teacher_rank: Optional[str] = None  # 교사직급
    # teacher_type: Optional[str] = None  # 교사유형
    # teacher_address: Optional[str] = None  # 교사주소
    # teacher_address_extra: Optional[str] = None  # 교사주소
    # teacher_phone_number: Optional[str] = None  # 교사전화번호
    # teacher_hp_number: Optional[str] = None  # 교사휴대폰번호
    # teacher_email: Optional[str] = None  # 교사이메일
    # teacher_zipcode: Optional[str] = None  # 교사우편번호
    # teacher_license_number: Optional[str] = None  # 교사자격증번호
    # teacher_license_date: Optional[str] = None  # 교사자격증발급일
    # teacher_license_valid_date: Optional[str] = None  # 교사자격증유효기간
    # teacher_license_type: Optional[str] = None  # 교사자격증유형
    # teacher_license_status: Optional[str] = None  # 교사자격증상태
    # teacher_license_agency: Optional[str] = None  # 교사자격증기관
    # # 학생관련 추가 정보
    # status: Optional[str] = None  # 상태 (대기, 등록, 종료)
    # disability_type: Optional[str] = None  # 장애유형
    # initial_consult_date: Optional[str] = None  # 초기상담일
    # referral_path: Optional[str] = None  # 유입경로
    # last_login: Optional[str] = None  # 마지막 로그인일
    # updated_at: Optional[str] = None  # 수정일
