import {
  Autocomplete,
  Button,
  Container,
  Pagination,
  Paper,
  Badge,
  Text,
  Title,
  Modal,
  Flex,
  TextInput,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FaSearch } from "react-icons/fa";
import styles from "../styles/questionAdd.module.css";
import { useToast } from "../hooks/useToast";
import { useUserState } from "../hooks/useUserState";
import { Question } from "../types/question_types";
import { alerts } from "../utils/alert-utils";
import {
  addInterviewSkillCategory,
  editInterviewSkillCategory,
  getInterviewSkillCategories,
  getPaginableInterviewSkillCategories,
} from "../apis/mycvtracker/interview-skill-catogory";
import { toInterviewTopics } from "../utils/interview-skill-category-utils";
import { InterviewSkillCategory } from "../types/interview_skill_category_type";
import { Paginable } from "../types/common_type";
import { useDebounce } from "../hooks/useDebounce";

const QuestionData = () => {
  const { showErrorToast } = useToast();

  const { token } = useUserState();
  const [toggleDisableLoading, setToggleDisableLoading] = useState(false);

  const [interviewSkills, setinterviewSkills] = useState<
    InterviewSkillCategory[]
  >([]);

  const [paginableInterviewSkills, setPaginableInterviewSkills] = useState<
    Paginable<InterviewSkillCategory>
  >({
    items: [],
    currentPage: 0,
    totalElements: 0,
    totalPages: 0,
  });

  const [selectedItem, setSelectedItem] = useState<InterviewSkillCategory>(
    {} as InterviewSkillCategory
  );
  const [openSkillCategoryModal, setOpenSkillCategoryModal] = useState(false);
  const [skillCategoryModalLoading, setSkillCategoryModalLoading] = useState(false);

  const getInterviewSkills = useCallback(
    async (params: Record<string, string | number> = {}) => {
      const res = await getInterviewSkillCategories({
        ...params,
        includedDisabled: true,
      });
      setinterviewSkills(res);
    },
    []
  );

  const getInterviewSkillsWithPagination = useCallback(
    async (params: Record<string, string | number> = {}) => {
      const res = await getPaginableInterviewSkillCategories({
        ...params,
        includedDisabled: true,
      });
      setPaginableInterviewSkills(res);
    },
    []
  );

  const debounceGetPaginableSkillCategories = useDebounce(
    getInterviewSkillsWithPagination,
    500
  );

  useEffect(() => {
    console.log("useEffect");

    getInterviewSkills();
    getInterviewSkillsWithPagination();
  }, [getInterviewSkills, getInterviewSkillsWithPagination]);

  const handleAutoCompleteChange = (value: string) => {
    details.setFieldValue("search", value);
    const { currentPage } = paginableInterviewSkills;
    debounceGetPaginableSkillCategories({ search: value, currentPage });
  };

  const handleToggleDisableCategory = async (
    category: InterviewSkillCategory
  ) => {
    setToggleDisableLoading(true);
    setSelectedItem(category);
    await editInterviewSkillCategory(token, {
      ...category,
      disabled: !category.disabled,
    });
    await getInterviewSkillsWithPagination({
      search: details.values.search,
      page: paginableInterviewSkills.currentPage,
    });
    setSelectedItem({} as InterviewSkillCategory);
    setToggleDisableLoading(false);
  };

  const handlePagination = (page: number) => {
    return getInterviewSkillsWithPagination({
      search: details.values.search,
      page: page - 1,
    });
  };


  const InterviewTopics = useMemo(
    () => toInterviewTopics(interviewSkills),
    [interviewSkills]
  );

  const interviewSkill = useForm({
    initialValues: {
      id: "",
      displayName: "",
      disabled: false,
    },
    validate: {
      id: (value) => (value.length < 1 ? "Please enter a value" : null),
      displayName: (value) =>
        value.length < 1 ? "Please enter a value" : null,
    },
  });

  type InterviewSkillFormType = typeof interviewSkill.values;
  const details = useForm({
    initialValues: {
      search: "",
    },
    validate: {
      search: (value) =>
        value.length < 1 ? "Please enter a valid type" : null,
    },
  });


  const toggleOpenSkillCategoryModal = useCallback(
    (
      category: InterviewSkillCategory | null = null
    ) => {
      setOpenSkillCategoryModal(!openSkillCategoryModal);
      if (category) {
        setSelectedItem(category);
        interviewSkill.setFieldValue("id", category.id);
        interviewSkill.setFieldValue("displayName", category.displayName);
        interviewSkill.setFieldValue("disabled", category.disabled);
        return;
      }
      setSelectedItem({} as InterviewSkillCategory);
      interviewSkill.reset();
    },
    [interviewSkill, openSkillCategoryModal],
  );


  const handleSubmitInterviewSkill = useCallback(
    async (values: InterviewSkillFormType) => {
      setSkillCategoryModalLoading(true)
      const action = !!selectedItem?.id ? editInterviewSkillCategory : addInterviewSkillCategory;
      try {
        await action(token, values);
         await getInterviewSkillsWithPagination({
          search: details.values.search,
          page: paginableInterviewSkills.currentPage,
        });

        toggleOpenSkillCategoryModal();
      } catch (e: any) {
        console.log(e);
        if (alerts[e.response.status])
          showErrorToast(alerts[e.response.status].message);
        else showErrorToast("The interview skill category is already exist");
      } finally {
        setSkillCategoryModalLoading(false)
      }
    },
    [selectedItem, token, getInterviewSkillsWithPagination, details.values.search, paginableInterviewSkills.currentPage, toggleOpenSkillCategoryModal, showErrorToast]
  );


  const toTableRows = (categories: InterviewSkillCategory[]) => {
    return categories.map((category) => {
      const { id, displayName, disabled } = category;
      return (
        <tr key={id}>
          <td>{displayName}</td>
          <td>{id}</td>
          <td>
            <Badge color={!disabled ? "blue" : "red"}>
              {!disabled ? "Enable" : "Disable"}
            </Badge>
          </td>
          <td className="text-right">
            <Text ta="center">
              <Button
                type="submit"
                my="md"
                size="xs"
                onClick={() => toggleOpenSkillCategoryModal(category)}
              >
                Edit
              </Button>
              <Button
                color="red"
                m="md"
                size="xs"
                loading={toggleDisableLoading && selectedItem?.id === id}
                onClick={() => handleToggleDisableCategory(category)}
              >
                {disabled ? "Enable" : "Disable"}
              </Button>
            </Text>
          </td>
        </tr>
      );
    });
  };

  const { totalPages, currentPage, items } = paginableInterviewSkills;

  return (
    <Container>
      <Title order={1}>Interview Skill Categories</Title>
      <Button
        sx={{ marginLeft: "10px" }}
        type="submit"
        variant="filled"
        my="sm"
        onClick={() => toggleOpenSkillCategoryModal()}
      >
        Add Skill
      </Button>
      <div>
        <Autocomplete
          radius="xl"
          size="md"
          my="md"
          data={InterviewTopics.map((t) => t.label)}
          {...details.getInputProps("search")}
          onChange={handleAutoCompleteChange}
          icon={<FaSearch size={18} />}
        />
      </div>
      <div className={styles.members_wrapper}>
        <table className={styles.members_table}>
          <thead>
            <tr>
              <th className={styles.hideCol__xs}>Display Name</th>
              <th className={styles.hideCol__xs}>Value</th>
              <th className={styles.hideCol__xs}>Status</th>
              <th className={styles.hideCol__xs}>
                <Text ta="center">Actions</Text>
              </th>
            </tr>
          </thead>
          <tbody>{toTableRows(items)}</tbody>
        </table>
      </div>
      {items && items.length > 0 && (
        <div className={styles.page}>
          <Pagination
            total={totalPages}
            page={currentPage + 1}
            position="center"
            onChange={handlePagination}
          />
        </div>
      )}
      <Modal
        opened={openSkillCategoryModal}
        onClose={() => toggleOpenSkillCategoryModal()}
        title="Create share interview"
      >
        <div>
          <Paper p="md" my="md">
            <form
              onSubmit={interviewSkill.onSubmit(handleSubmitInterviewSkill)}
            >
              <>
                <TextInput
                  placeholder="Value"
                  label="Value"
                  my="xs"
                  readOnly={!!selectedItem?.id}
                  withAsterisk
                  {...interviewSkill.getInputProps("id")}
                />
                <TextInput
                  placeholder="Display Name"
                  label="Display Name"
                  my="xs"
                  withAsterisk
                  {...interviewSkill.getInputProps("displayName")}
                />
                <Checkbox
                  mt={16}
                  label="Disable Category"
                  checked={interviewSkill.values.disabled}
                  {...interviewSkill.getInputProps("disabled")}
                />
                <Flex mt={32} justify="flex-end">
                  <Button
                    w={100}
                    type="submit"
                    variant="filled"
                    my="sm"
                    disabled={skillCategoryModalLoading}
                    loading={skillCategoryModalLoading}
                  >
                    Submit
                  </Button>
                  <Button
                    w={100}
                    type="button"
                    variant="filled"
                    my="sm"
                    color="red"
                    className={styles.skip_emp}
                    onClick={() => toggleOpenSkillCategoryModal()}
                  >
                    Cancel
                  </Button>
                </Flex>

                {/* <Button
              type="button"
              variant="light"
              m="sm"
              onClick={() => details.onSubmit(handleSendReminder)()}
              disabled={isLoading}
              loading={isLoading}
            >
              Send Reminder Interview
            </Button> */}
              </>
            </form>
          </Paper>
        </div>
      </Modal>
    </Container>
  );
};

export default QuestionData;
